/* Formulário de briefing (público, estático) — Ascend Digital.
 * Barra de progresso + envio real para a edge function submit-briefing.
 * Os campos usam os mesmos nomes do payload da API (envio 1:1).
 *
 * As constantes abaixo são públicas por design (anon/publishable key).
 * Se o projeto Supabase mudar, atualize também src/integrations/supabase/client.ts
 * e o CSP em nginx.conf / index.html.
 */
(function () {
  "use strict";

  var SUPABASE_URL = "https://fjxwyqtxtszasxrqqfpd.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_b4-BtUXfaCug4uheuMq73g_9HRODsBI";
  var SUBMIT_URL = SUPABASE_URL + "/functions/v1/submit-briefing";

  var FIELDS = [
    "name", "whatsapp", "email", "business_name",
    "project_type", "deadline", "description", "current_tools", "kpis", "plan",
  ];

  var form = document.getElementById("briefingForm");
  var fill = document.getElementById("progressFill");
  var pct = document.getElementById("pct");
  var errorBox = document.getElementById("formError");
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  var submitLabel = submitBtn ? submitBtn.innerHTML : "";

  if (!form) return;

  function updateProgress() {
    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    var done = required.filter(function (el) { return (el.value || "").trim(); }).length;
    var p = required.length ? Math.round((done / required.length) * 100) : 0;
    fill.style.width = p + "%";
    pct.textContent = p + "%";
  }
  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  function val(name) {
    var el = form.elements[name];
    return el ? (el.value || "").trim() : "";
  }
  function setError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg || "";
    errorBox.style.display = msg ? "block" : "none";
  }
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", loading ? "true" : "false");
    submitBtn.innerHTML = loading ? "Enviando…" : submitLabel;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setError("");
    if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

    if (val("company_website")) { showSuccess(); return; }

    var payload = { company_website: "" };
    FIELDS.forEach(function (f) { payload[f] = val(f) || null; });
    // obrigatórios como string (não null)
    ["name", "whatsapp", "email", "business_name", "project_type"].forEach(function (f) {
      payload[f] = val(f);
    });

    setLoading(true);
    fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data && data.error ? data.error : "Não foi possível enviar agora.");
          return data;
        });
      })
      .then(function () { showSuccess(); })
      .catch(function (err) {
        setLoading(false);
        setError((err && err.message ? err.message : "Erro de conexão.") + " Você também pode falar direto no WhatsApp.");
      });
  });

  function showSuccess() {
    form.style.display = "none";
    var success = document.getElementById("successScreen");
    if (success) success.classList.add("show");
    var progress = document.querySelector(".progress-wrap");
    if (progress) progress.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateProgress();
})();
