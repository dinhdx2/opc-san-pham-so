export const meta = {
  name: 'vn-debate',
  description: 'Hội đồng phòng ban vn-opc tranh luận đối kháng 1 brief → decision report (v2: cross-examination + red-team)',
  phases: [
    { title: 'Perspectives' },
    { title: 'Cross-examination' },
    { title: 'Red-team' },
    { title: 'Synthesize' },
  ],
}

// ── args ─────────────────────────────────────────────────────────────────────
// { brief, brainContext, departments: string[] (vd ["dept-03-finance"]),
//   vault?: string (đường-dẫn vault active, vd "vaults/san-pham-so" — dept agent đọc persona
//     từ <vault>/01-Departments/<phòng>/; trống → agent tự đọc con-trỏ .vn-active-vault),
//   scale?: 'SIMPLE'|'COMPLEX'|'STRATEGIC' (mặc định suy từ số phòng),
//   devilsAdvocate?: string (mã dept được chỉ định phản biện đa số — luân phiên do orchestrator chọn) }
// Tương-thích harness: một số runtime giao `args` dưới dạng CHUỖI JSON thay vì object → chuẩn-hoá về object.
const A = (typeof args === 'string') ? (() => { try { return JSON.parse(args) } catch (e) { return {} } })() : (args || {})
const DEPTS = (A && A.departments) || []
const BRIEF = (A && A.brief) || ''
const BRAIN = (A && A.brainContext) || ''
// Persona per-vault (chỉ-đọc-vault): truyền đường dẫn vault cho dept agent đọc <vault>/01-Departments/.
const VAULT = (A && (A.vault || A.vaultPath)) || ''
const VAULT_LINE = `VAULT: ${VAULT || '(trống — tự đọc con-trỏ .vn-active-vault ở gốc repo)'}\n\n`
const SCALE =
  (A && A.scale) ||
  (DEPTS.length <= 2 ? 'SIMPLE' : DEPTS.length <= 6 ? 'COMPLEX' : 'STRATEGIC')
// Luật sư của quỷ: 1 phòng/task bắt buộc phản đối đa số để phá thiên kiến đồng thuận.
// Mặc định phòng cuối danh sách (orchestrator có thể truyền devilsAdvocate để luân phiên qua các task).
const DEVIL = (A && A.devilsAdvocate) || (DEPTS.length ? DEPTS[DEPTS.length - 1] : null)
// STRATEGIC chạy thêm 1 vòng cross-exam (loop-until-dry, trần 2 vòng); có guard token.
const MAX_XEXAM_ROUNDS = SCALE === 'STRATEGIC' ? 2 : 1

// ── Model tiering + escalation ladder (TRỤ 4: kỷ luật chi phí) ────────────────
// LƯU Ý: Workflow agent() KHÔNG tự áp `model:` trong frontmatter của agentType
// (mặc định dùng model phiên). Phải set model TƯỜNG MINH ở đây để tier có hiệu lực.
// Tier khai báo: Opus cho 3 phòng lõi rủi ro cao (Pháp chế/Chiến lược/Tài chính)
// + red-team + synthesizer; Sonnet cho phần còn lại.
const CORE_OPUS = new Set(['dept-01-governance', 'dept-02-strategy', 'dept-03-finance'])
// Escalation ladder: SIMPLE (brief hẹp) → toàn Sonnet cho rẻ;
//                    COMPLEX/STRATEGIC → Opus cho phòng lõi, Sonnet cho phần còn lại.
const deptModel = d => (SCALE === 'SIMPLE' ? 'sonnet' : CORE_OPUS.has(d) ? 'opus' : 'sonnet')
const HEAVY = SCALE === 'SIMPLE' ? 'sonnet' : 'opus' // red-team + synthesizer (chất lượng/an toàn)
const LIGHT = 'sonnet'                               // trích claim + pro/con (việc cơ học)
log(`Scale=${SCALE} · ${DEPTS.length} phòng · model lõi=${HEAVY} · devil=${DEVIL || '—'} · max cross-exam=${MAX_XEXAM_ROUNDS} vòng.`)

// ── schemas ──────────────────────────────────────────────────────────────────
const PERSPECTIVE_SCHEMA = {
  type: 'object',
  properties: {
    department:     { type: 'string' },
    role_used:      { type: 'string' },
    assessment:     { type: 'string' },
    recommendation: { type: 'string' },
    concerns:       { type: 'string' },
    citations:      { type: 'array', items: { type: 'string' } },
  },
  required: ['department', 'assessment', 'recommendation'],
}

const REBUTTAL_SCHEMA = {
  type: 'object',
  properties: {
    department:             { type: 'string' },
    stance:                 { type: 'string', enum: ['giữ_nguyên', 'điều_chỉnh', 'rút_lại'] },
    changed_position:       { type: 'boolean' },
    updated_recommendation: { type: 'string' },
    rebuttals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          target_department: { type: 'string' },
          point:             { type: 'string' },
        },
        required: ['target_department', 'point'],
      },
    },
    concessions: { type: 'string' },
  },
  required: ['department', 'stance', 'changed_position'],
}

const CLAIMS_SCHEMA = {
  type: 'object',
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim:             { type: 'string' },
          source_department: { type: 'string' },
          why_high_stakes:   { type: 'string' },
        },
        required: ['claim', 'source_department'],
      },
    },
  },
  required: ['claims'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    claim:                  { type: 'string' },
    verdict:                { type: 'string', enum: ['refuted', 'survives', 'uncertain'] },
    reasoning:              { type: 'string' },
    risk_if_wrong:          { type: 'string' },
    legal_compliance_flag:  { type: 'boolean' }, // true nếu claim chạm rủi ro pháp lý/khóa tài khoản
  },
  required: ['claim', 'verdict', 'reasoning'],
}

// ── helpers ──────────────────────────────────────────────────────────────────
const deptName = code => code.replace(/^dept-/, '')
const summarize = vlist =>
  vlist
    .map(v => `- ${v.department} (${v.role_used || ''}): ĐỀ XUẤT=${v.recommendation}; LO NGẠI=${v.concerns || '—'}`)
    .join('\n')

// ── Phase 1: Quan điểm từng phòng (song song) ────────────────────────────────
phase('Perspectives')

const rawViews = await parallel(
  DEPTS.map(d => () => {
    const devilNote =
      d === DEVIL
        ? '\n\n⚠️ BẠN ĐƯỢC CHỈ ĐỊNH LÀM "LUẬT SƯ CỦA QUỶ" cho phiên này: chủ động nêu mặt trái, phản biện phương án có vẻ hiển nhiên, tìm lý do KHÔNG nên làm — kể cả khi xu hướng chung đồng thuận.'
        : ''
    return agent(
      `${VAULT_LINE}Brief:\n${BRIEF}\n\nBrain context:\n${BRAIN}\n\nNêu góc nhìn của phòng theo đúng chuyên môn. Tuân quy tắc grounding: số phải gắn nhãn [số thật DN] hoặc [benchmark ngành — cần CEO xác minh].${devilNote}`,
      { agentType: d, label: d === DEVIL ? `${d} (devil)` : d, phase: 'Perspectives', schema: PERSPECTIVE_SCHEMA, model: deptModel(d) }
    ).then(v => (v ? { deptType: d, view: v } : null))
  })
).then(arr => arr.filter(Boolean))

let viewList = rawViews.map(x => x.view)

// ── Phase 2: Cross-examination (các phòng thấy nhau → phản biện/đổi ý) ────────
phase('Cross-examination')

let crossExam = []
let lastRoundChanged = true
for (let round = 1; round <= MAX_XEXAM_ROUNDS; round++) {
  // Guard token: STRATEGIC vòng 2 chỉ chạy nếu còn ngân sách rộng rãi.
  if (round > 1) {
    if (!lastRoundChanged) { log(`Cross-exam vòng ${round - 1}: không phòng nào đổi ý → dừng (đã hội tụ).`); break }
    if (budget.total && budget.remaining() < 80_000) { log(`Hết ngân sách token → dừng cross-exam ở vòng ${round - 1}.`); break }
  }

  const others = summarize(viewList)
  const roundResult = await parallel(
    rawViews.map(x => () => {
      const devilNote =
        x.deptType === DEVIL
          ? ' BẠN là luật sư của quỷ: bắt buộc nêu ít nhất 1 phản biện mạnh nhắm vào khuyến nghị của ĐA SỐ.'
          : ''
      return agent(
        `${VAULT_LINE}Đây là quan điểm TẤT CẢ các phòng (vòng ${round}):\n${others}\n\n` +
          `Quan điểm của CHÍNH phòng bạn trước đó: ${JSON.stringify(x.view.recommendation)}.\n` +
          `Sau khi đọc các phòng khác: bạn GIỮ NGUYÊN, ĐIỀU CHỈNH, hay RÚT LẠI? ` +
          `Nêu phản biện cụ thể nhắm vào phòng nào (rebuttals), nhượng bộ điểm nào (concessions).${devilNote}`,
        { agentType: x.deptType, label: `rebut:${deptName(x.deptType)}`, phase: 'Cross-examination', schema: REBUTTAL_SCHEMA, model: deptModel(x.deptType) }
      )
    })
  ).then(arr => arr.filter(Boolean))

  crossExam = roundResult
  lastRoundChanged = roundResult.some(r => r.changed_position)

  // Cập nhật viewList theo các phòng đã điều chỉnh/rút lại để vòng sau (và synthesizer) phản ánh đúng.
  for (const r of roundResult) {
    if (r.changed_position && r.updated_recommendation) {
      const hit = viewList.find(v => v.department === r.department)
      if (hit) hit.recommendation = r.updated_recommendation
    }
  }
  log(`Cross-exam vòng ${round}: ${crossExam.filter(r => r.changed_position).length}/${crossExam.length} phòng đổi ý.`)
}

// ── Phase 3: Red-team / Verifier (refute mặc định) ───────────────────────────
phase('Red-team')

const claimSet = await agent(
  `Từ quan điểm các phòng + cross-examination dưới đây, trích TỐI ĐA 5 claim/khuyến nghị RỦI RO CAO NHẤT ` +
    `(dễ bị hành động sai, chạm pháp lý/dòng tiền/khóa tài khoản, hoặc dựa trên số chưa xác minh).\n` +
    `LUẬT optimize-before-scale (luồng generic v3): GẮN CỜ mọi khuyến nghị "nhân-bản/mở-rộng/gọi-vốn KHI CHƯA qua cổng tối-ưu" ` +
    `(nhân chưa-sạch = nhân-lỗi cả-đàn) như claim rủi-ro cao; với brief MỞ-RỘNG, soi thêm 3 phép-thử moat/telos/brand.\n\n` +
    `Quan điểm:\n${JSON.stringify(viewList, null, 2)}\n\nCross-exam:\n${JSON.stringify(crossExam, null, 2)}`,
  { label: 'extract-claims', phase: 'Red-team', schema: CLAIMS_SCHEMA, model: LIGHT }
)
const claims = (claimSet && claimSet.claims) || []

const redTeam = await parallel(
  claims.map(c => () =>
    agent(
      `Bạn là RED-TEAM độc lập. Nhiệm vụ: CỐ GẮNG BÁC BỎ claim sau. Mặc định verdict='refuted' trừ khi claim ` +
        `thực sự vững. Đặc biệt soi rủi ro pháp lý/tuân thủ (vd dùng danh tính ảo, lách TOS, lách thuế) — ` +
        `set legal_compliance_flag=true nếu có.\n\n` +
        `CLAIM: ${c.claim}\nNguồn: ${c.source_department}\nVì sao rủi ro: ${c.why_high_stakes || '—'}\n\n` +
        `Brief:\n${BRIEF}\n\nBrain:\n${BRAIN}`,
      { label: `redteam:${(c.source_department || 'x').slice(0, 18)}`, phase: 'Red-team', schema: VERDICT_SCHEMA, model: HEAVY, effort: 'high' }
    )
  )
).then(arr => arr.filter(Boolean))

// Tổng hợp tranh luận Pro/Con ngắn (giữ tương thích trường `debate`).
const debate = await agent(
  `Tóm tắt tranh luận thành Pro/Con + 3 góc nhìn (Tăng trưởng / Thận trọng / Cân bằng), nêu các xung đột chưa giải.\n\n` +
    `Quan điểm:\n${JSON.stringify(viewList, null, 2)}\n\nCross-exam:\n${JSON.stringify(crossExam, null, 2)}`,
  { label: 'pro-con', phase: 'Red-team', model: LIGHT }
)

// ── Phase 4: Tổng hợp DECISION REPORT ────────────────────────────────────────
phase('Synthesize')

const report = await agent(
  `Tổng hợp thành DECISION REPORT tiếng Việt theo cấu trúc synthesizer, CEO-friendly, mở đầu TL;DR ≤3 câu.\n` +
    `BẮT BUỘC có mục "⚔️ Red-team / Kiểm chứng đối kháng": liệt kê claim bị refuted + mọi legal_compliance_flag=true ` +
    `như CẢNH BÁO ĐỎ. Ghi rõ phòng nào đổi ý sau cross-exam.\n\n` +
    `Brief gốc:\n${BRIEF}\n\nQuan điểm phòng (đã cập nhật sau cross-exam):\n${JSON.stringify(viewList, null, 2)}\n\n` +
    `Cross-exam:\n${JSON.stringify(crossExam, null, 2)}\n\nRed-team:\n${JSON.stringify(redTeam, null, 2)}\n\nTranh luận:\n${debate}`,
  { agentType: 'synthesizer', label: 'synthesizer', phase: 'Synthesize', model: HEAVY }
)

return { scale: SCALE, devilsAdvocate: DEVIL, views: viewList, crossExam, redTeam, debate, report }
