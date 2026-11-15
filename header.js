// Cabeçalho. Busca: abre a partir da lupa; sem JS o botão só leva à página de busca.
const f = document.querySelector("header .search");
if (f) {
  const i = f.querySelector("input"), b = f.querySelector("button");
  const set = (open) => { f.classList.toggle("open", open); b.setAttribute("aria-expanded", open); };
  set(false);
  b.addEventListener("click", (e) => {
    if (!f.classList.contains("open")) { e.preventDefault(); set(true); i.focus(); }
    else if (!i.value.trim()) { e.preventDefault(); set(false); }
  });
  f.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); b.focus(); } });
  document.addEventListener("click", (e) => { if (!f.contains(e.target) && !i.value.trim()) set(false); });
}

// Menu lateral (celular): abre/fecha com animação, Esc e clique no fundo também fecham.
const nav = document.querySelector("header nav"), scrim = document.querySelector(".scrim");
const abrir = document.querySelector(".menu-btn"), fechar = document.querySelector(".menu-close");
if (nav && scrim && abrir && fechar) {
  const show = (v) => {
    nav.classList.toggle("open", v);
    scrim.classList.toggle("open", v);
    abrir.setAttribute("aria-expanded", v);
    document.body.style.overflow = v ? "hidden" : "";
    (v ? fechar : abrir).focus();
  };
  abrir.addEventListener("click", () => show(true));
  fechar.addEventListener("click", () => show(false));
  scrim.addEventListener("click", () => show(false));
  nav.addEventListener("keydown", (e) => { if (e.key === "Escape") show(false); });
}

// Acessibilidade: tema de cor (data-tema) e tamanho da fonte, lembrados no navegador.
const A = document.querySelector(".a11y");
if (A) {
  const root = document.documentElement;
  const guarda = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
  const btn = A.querySelector(".a11y-btn"), sub = A.querySelector("#a11y-cores"), main = A.querySelector("#a11y-principal");
  const cores = A.querySelector("[data-cores]");
  const temas = [...A.querySelectorAll("[data-tema]")];
  const mais = A.querySelector("[data-fonte=mais]"), menos = A.querySelector("[data-fonte=menos]"), orig = A.querySelector("[data-fonte=original]");
  const abrir = (v) => { A.classList.toggle("open", v); btn.setAttribute("aria-expanded", v); if (!v) { main.hidden = false; sub.hidden = true; A.querySelectorAll(".a11y-desc").forEach((p) => { p.hidden = true; }); A.querySelectorAll(".a11y-info").forEach((b) => b.setAttribute("aria-expanded", false)); } };
  btn.addEventListener("click", () => abrir(!A.classList.contains("open")));
  cores.addEventListener("click", () => { main.hidden = true; sub.hidden = false; sub.querySelector("button").focus(); });
  const tema = (t) => {
    if (t) root.dataset.tema = t; else delete root.dataset.tema;
    guarda("colore-tema", t || null);
    temas.forEach((b) => b.setAttribute("aria-pressed", b.dataset.tema === t));
  };
  tema(root.dataset.tema || "");
  temas.forEach((b) => b.addEventListener("click", () => tema(b.dataset.tema)));
  const passos = [87.5, 100, 112.5, 125, 150];
  let i = passos.indexOf(parseFloat(root.style.fontSize));
  if (i < 0) i = 1;
  const fonte = (n) => {
    i = n;
    root.style.fontSize = n === 1 ? "" : passos[n] + "%";
    guarda("colore-fonte", n === 1 ? null : passos[n]);
    mais.disabled = n === passos.length - 1;
    menos.disabled = n === 0;
    orig.setAttribute("aria-pressed", n === 1);
  };
  fonte(i);
  mais.addEventListener("click", () => fonte(i + 1));
  menos.addEventListener("click", () => fonte(i - 1));
  orig.addEventListener("click", () => fonte(1));
  A.querySelectorAll(".a11y-info").forEach((b) => b.addEventListener("click", () => {
    const p = document.getElementById(b.getAttribute("aria-controls"));
    p.hidden = !p.hidden;
    b.setAttribute("aria-expanded", !p.hidden);
  }));
  const mq = matchMedia("(max-width: 47.99rem)");
  const lugar = () => { const dest = mq.matches && nav ? nav : document.querySelector(".tools"); if (dest && A.parentNode !== dest) dest.append(A); };
  mq.addEventListener("change", lugar);
  lugar();
  A.addEventListener("keydown", (e) => { if (e.key === "Escape") { abrir(false); btn.focus(); } });
  document.addEventListener("click", (e) => { if (!A.contains(e.target)) abrir(false); });
}
