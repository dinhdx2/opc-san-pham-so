// POST /api/lead  — nhận lead từ form "template miễn phí".
// Neu set env LEAD_WEBHOOK_URL (vd Google Apps Script / Zapier / n8n webhook) -> forward de LUU that.
// Khong set -> van tra ok (UI hien thanh cong + Pixel da track Lead), lead ghi vao log Vercel.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  try {
    var b = req.body || {};
    var name = (b.name || "").toString().slice(0, 120);
    var email = (b.email || "").toString().slice(0, 200);
    var phone = (b.phone || "").toString().slice(0, 40);
    if (!email || email.indexOf("@") === -1) return res.status(400).json({ ok: false, error: "invalid_email" });

    var payload = { name: name, email: email, phone: phone, ts: new Date().toISOString(), source: "donthat-landing" };
    var hook = process.env.LEAD_WEBHOOK_URL;
    if (hook) {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      console.log("[lead]", JSON.stringify(payload));
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    // Khong bao gio chan UX vi loi backend
    return res.status(200).json({ ok: true, note: "logged_only" });
  }
}
