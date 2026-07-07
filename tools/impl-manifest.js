'use strict'
// tools/impl-manifest.js — bản-đồ "spec → milestone → artifact code/knowledge → test".
// Cơ-chế truy-vết IMPLEMENT (song-song với specs/_claims.md cho SoT): bảo-đảm mỗi hạng-mục
// §9 của bộ spec luong-generic-v3 có điểm-cắm THẬT trong repo + được test (nếu là generic).

module.exports = [
  { milestone: 'M1', ten: 'telos + altitude (Brain 2 lớp + G0)', spec: ['02', '08'],
    artifacts: [
      'lib/brain.js', 'knowledge/brain-schema.md',
      'vaults/_TEMPLATE/00-Brain/_SEED.md',
      'test/brain.test.js',
    ] },
  { milestone: 'M2', ten: 'taxonomy + stage-detect + tên-kép', spec: ['04', '03a', '06'],
    artifacts: [
      'knowledge/taxonomy/aspects.yaml', 'knowledge/taxonomy/blocks.yaml',
      'knowledge/rule-engines/stage-rubric.yaml', 'knowledge/rule-engines/aspect-goal.yaml',
      'knowledge/rule-engines/naming-canonical.yaml',
      'lib/taxonomy.js', 'lib/rule-engines.js',
      'knowledge/departments/05-operations/department.yaml', 'knowledge/packs/fnb/pack.yaml',
      'skills/vn-orchestrator/SKILL.md', '.claude/skills/vn-orchestrator/SKILL.md',
      'test/taxonomy.test.js', 'test/rule-engines.test.js',
    ] },
  { milestone: 'M4', ten: 'rule-engines + KHO + vn-architect', spec: ['06', '05', '03b', '01'],
    artifacts: [
      'lib/tier.js', 'lib/kho.js',
      'knowledge/rule-engines/taskgen-grid.yaml', 'knowledge/rule-engines/reuse-rubric.yaml',
      'knowledge/rule-engines/loop-routing.yaml',
      'knowledge/playbook/README.md', 'knowledge/playbook/_TEMPLATE/_index.md',
      '.claude/skills/vn-architect/SKILL.md', 'skills/vn-architect/SKILL.md',
      'test/tier.test.js', 'test/kho.test.js',
    ] },
  { milestone: 'M3/M5/M6', ten: 'curves + lens 3 chiều + khép-vòng/PROMOTE/PHA4', spec: ['03c', '03d', '03e'],
    artifacts: [
      'lib/flow.js', 'lib/loop.js', 'knowledge/rule-engines/loop-config.yaml',
      'skills/vn-executor/SKILL.md', '.claude/skills/vn-executor/SKILL.md',
      'workflows/debate.js',
      'test/flow.test.js', 'test/loop.test.js',
    ] },
  { milestone: 'B7', ten: 'golden end-to-end Phở Hà (đấu-dây §9 nghiệm gián-tiếp)', spec: ['07', '09', '03'],
    artifacts: [
      'test/golden-pho-ha.test.js', 'test/fixtures/fnb_index.md',
    ] },
]
