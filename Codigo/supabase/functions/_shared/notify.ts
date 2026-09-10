// Notificação por e-mail via Resend. No-op silencioso se os secrets
// RESEND_API_KEY / BRIEFING_NOTIFY_EMAIL não estiverem configurados.
// Nunca lança: falha de e-mail não pode derrubar o envio do formulário.

export async function sendBriefingEmail(fields: Record<string, string | null>): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("BRIEFING_NOTIFY_EMAIL");
  if (!apiKey || !to) return;

  const from = Deno.env.get("RESEND_FROM") ?? "Ascend Visual <onboarding@resend.dev>";

  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8A8078;font-size:13px">${k}</td><td style="padding:4px 0;font-size:13px"><strong>${escapeHtml(String(v))}</strong></td></tr>`)
    .join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Novo briefing — ${fields.business_name ?? fields.name ?? "sem nome"}`,
        html: `<h2 style="font-family:sans-serif">Novo briefing recebido</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
      }),
    });
    if (!res.ok) console.error("Resend falhou:", res.status, await res.text());
  } catch (err) {
    console.error("Resend erro:", err);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}
