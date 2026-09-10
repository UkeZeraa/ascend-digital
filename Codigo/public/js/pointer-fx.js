/* Animações de mouse para as páginas estáticas (briefing.html, portfolio.html).
 * Cursor customizado + tilt 3D ([data-tilt]) + magnético ([data-magnetic])
 * + parallax ([data-parallax] com data-depth). No-op em toque / movimento reduzido.
 * Sem handlers inline (CSP script-src 'self'). */
(function () {
  "use strict";

  function canAnimate() {
    return (
      window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  if (!canAnimate()) return;

  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  // ── Cursor ────────────────────────────────────────────────────────
  var dot = document.createElement("div");
  var ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  root.classList.add("has-custom-cursor");

  var SEL = "a,button,[role='button'],input,textarea,select,label,[data-cursor]";
  window.addEventListener("pointermove", function (e) {
    root.style.setProperty("--cursor-x", e.clientX + "px");
    root.style.setProperty("--cursor-y", e.clientY + "px");
  }, { passive: true });
  document.addEventListener("pointerover", function (e) {
    if (e.target.closest && e.target.closest(SEL)) root.classList.add("cursor-hot");
  });
  document.addEventListener("pointerout", function (e) {
    if (e.target.closest && e.target.closest(SEL)) root.classList.remove("cursor-hot");
  });
  window.addEventListener("pointerdown", function () { root.classList.add("cursor-down"); });
  window.addEventListener("pointerup", function () { root.classList.remove("cursor-down"); });
  document.addEventListener("mouseleave", function () { root.classList.add("cursor-hidden"); });
  document.addEventListener("mouseenter", function () { root.classList.remove("cursor-hidden"); });

  // ── Tilt ──────────────────────────────────────────────────────────
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    var max = parseFloat(el.getAttribute("data-tilt")) || 7;
    var raf = 0;
    el.style.transition = "transform 0.25s ease-out";
    el.style.willChange = "transform";
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.transform =
          "perspective(900px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg)";
      });
    });
    el.addEventListener("pointerleave", function () {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });

  // ── Magnético ─────────────────────────────────────────────────────
  document.querySelectorAll("[data-magnetic]").forEach(function (el) {
    var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.35;
    el.style.transition = "transform 0.2s cubic-bezier(0.33,1,0.68,1)";
    el.style.willChange = "transform";
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      el.style.transform =
        "translate(" + clamp(dx * strength, -14, 14).toFixed(1) + "px," + clamp(dy * strength, -14, 14).toFixed(1) + "px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = "translate(0,0)"; });
  });

  // ── Parallax ──────────────────────────────────────────────────────
  var pxEls = document.querySelectorAll("[data-parallax]");
  if (pxEls.length) {
    var praf = 0;
    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(praf);
      praf = requestAnimationFrame(function () {
        pxEls.forEach(function (el) {
          var depth = parseFloat(el.getAttribute("data-depth")) || 30;
          el.style.transform = "translate(" + (nx * depth).toFixed(1) + "px," + (ny * depth).toFixed(1) + "px)";
        });
      });
    }, { passive: true });
  }
})();
