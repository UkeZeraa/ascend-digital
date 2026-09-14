/* Aviso discreto de privacidade/LGPD para as páginas estáticas (briefing.html, portfolio.html).
   Mesma chave de localStorage que o <CookieConsent> do React — some numa página, some nas duas. */
(function () {
  "use strict";

  var STORAGE_KEY = "ascend-privacy-notice";

  try {
    if (window.localStorage && localStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (e) {
    // localStorage indisponível (modo privado etc.) — mostra o aviso mesmo assim
  }

  function mount() {
    var bar = document.createElement("div");
    bar.className = "privacy-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Aviso de privacidade");
    bar.innerHTML =
      '<p>Usamos o mínimo de dados necessário pra te atender: as informações que você envia ' +
      "no formulário ficam guardadas com segurança só pra isso. Sem cookies de rastreamento. " +
      '<a href="/privacidade.html">Política de Privacidade</a></p>' +
      '<button type="button">Entendi</button>';
    document.body.appendChild(bar);

    var btn = bar.querySelector("button");
    btn.addEventListener("click", function () {
      bar.classList.add("privacy-bar-hide");
      window.setTimeout(function () {
        bar.remove();
      }, 220);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {
        // ignora — só não vai lembrar na próxima visita
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
