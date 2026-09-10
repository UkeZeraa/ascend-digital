import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { buildCors, jsonResponse } from "../_shared/cors.ts";
import { clientIp, isRateLimited } from "../_shared/rate-limit.ts";
import { isHoneypotTripped, validateBriefing } from "../_shared/validate.ts";
import { sendBriefingEmail } from "../_shared/notify.ts";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: buildCors(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  const ip = clientIp(req);
  if (isRateLimited(`briefing:${ip}`, 5)) {
    return jsonResponse({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Corpo inválido." }, 400, origin);
  }

  // Honeypot: campo invisível preenchido => provável bot. Responde 200 sem inserir.
  if (isHoneypotTripped(body.company_website)) {
    return jsonResponse({ success: true }, 200, origin);
  }

  const result = validateBriefing(body);
  if (!result.ok) {
    return jsonResponse({ error: result.error }, 400, origin);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase.from("briefings").insert(result.data);
  if (error) {
    console.error("Insert error:", error);
    return jsonResponse({ error: "Erro ao salvar. Tente novamente." }, 500, origin);
  }

  // E-mail é best-effort e não bloqueia a resposta de sucesso.
  await sendBriefingEmail(result.data);

  return jsonResponse({ success: true }, 200, origin);
});
