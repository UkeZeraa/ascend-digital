/* Portfólio estático: filtros, modais acessíveis e reveal on-scroll.
 * Sem handlers inline (CSP script-src 'self'). */
(function () {
  "use strict";

  var lastFocus = null;

  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add("open");
    document.body.style.overflow = "hidden";
    var close = m.querySelector("[data-close]");
    if (close) close.focus();
  }

  function closeModal(m) {
    m.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function closeAll() {
    document.querySelectorAll(".modal-overlay.open").forEach(closeModal);
  }

  // Filtros
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".pf-card").forEach(function (c) {
        c.style.display = cat === "todos" || c.dataset.cat === cat ? "" : "none";
      });
    });
  });

  // Abrir modal a partir do card (clique ou Enter/Espaço)
  document.querySelectorAll(".pf-card[data-modal]").forEach(function (card) {
    var target = card.dataset.modal;
    card.addEventListener("click", function () { openModal(target); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(target); }
    });
  });

  // Fechar: botão, clique no overlay, Escape
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
    var btn = overlay.querySelector("[data-close]");
    if (btn) btn.addEventListener("click", function () { closeModal(overlay); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }
})();
