// Cabeçalho (busca, menu, acessibilidade, rolagem) e rodapé. Todas as páginas.
(() => {

// Busca: abre a partir da lupa; sem JS o botão só leva à página de busca.
const f = document.querySelector(".hdr .search");
if (f) {
  const i = f.querySelector("input"), b = f.querySelector("button");
  const set = (open) => { f.classList.toggle("open", open); b.setAttribute("aria-expanded", open); };
  set(false);
  b.addEventListener("click", (e) => {
    if (!f.classList.contains("open")) { e.preventDefault(); set(true); i.focus({ preventScroll: true }); }
    else if (!i.value.trim()) { e.preventDefault(); set(false); }
  });
  f.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); b.focus({ preventScroll: true }); } });
  document.addEventListener("click", (e) => { if (!f.contains(e.target) && !i.value.trim()) set(false); });
}

// Menu (telas estreitas): desce do cabeçalho; Esc, clique fora e escolher um link fecham.
const nav = document.querySelector(".nav-wrap"), abrir = document.querySelector(".menu-btn");
if (nav && abrir) {
  const show = (v) => { nav.classList.toggle("open", v); abrir.setAttribute("aria-expanded", v); };
  abrir.addEventListener("click", () => show(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) show(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { show(false); abrir.focus({ preventScroll: true }); } });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target) && !abrir.contains(e.target)) show(false); });
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
  const abre = (v) => { A.classList.toggle("open", v); btn.setAttribute("aria-expanded", v); if (!v) { main.hidden = false; sub.hidden = true; A.querySelectorAll(".a11y-desc").forEach((p) => { p.hidden = true; }); A.querySelectorAll(".a11y-info").forEach((b) => b.setAttribute("aria-expanded", false)); } };
  btn.addEventListener("click", () => abre(!A.classList.contains("open")));
  cores.addEventListener("click", () => { main.hidden = true; sub.hidden = false; sub.querySelector("button").focus({ preventScroll: true }); });
  const tema = (t) => {
    if (t) root.dataset.tema = t; else delete root.dataset.tema;
    guarda("colore-tema", t || null);
    temas.forEach((b) => b.setAttribute("aria-pressed", b.dataset.tema === t));
  };
  // ao escolher um modo, só o descritivo dele fica aberto
  const descricao = (t) => A.querySelectorAll(".a11y-info").forEach((i) => {
    const p = document.getElementById(i.getAttribute("aria-controls")), abreP = t !== "" && p.id === "info-" + t;
    p.hidden = !abreP;
    i.setAttribute("aria-expanded", abreP);
  });
  tema(root.dataset.tema || "");
  temas.forEach((b) => b.addEventListener("click", () => { tema(b.dataset.tema); descricao(b.dataset.tema); }));
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
  A.addEventListener("keydown", (e) => { if (e.key === "Escape") { abre(false); btn.focus({ preventScroll: true }); } });
  document.addEventListener("click", (e) => { if (!A.contains(e.target)) abre(false); });
}

// Cabeçalho some ao rolar para baixo e volta no primeiro gesto para cima.
const cab = document.querySelector(".hdr");
if (cab) {
  let y0 = scrollY;
  const emUso = () => cab.matches(":focus-within") || (nav && nav.classList.contains("open")) || cab.querySelector(".a11y.open");
  addEventListener("scroll", () => {
    const y = scrollY, dy = y - y0;
    y0 = y;
    if (y <= 0 || dy < 0) cab.classList.remove("oculto");
    else if (dy > 0 && y > cab.offsetHeight && !emUso()) cab.classList.add("oculto");
  }, { passive: true });
}

// Nav: cada hover sorteia uma cor da paleta, menos a da própria barra (rosa). Por modo de daltonismo, só entram
// as cores que continuam diferentes da barra e com contraste para o texto grafite.
{
  const cores = {
    "": ["--yellow", "--orange", "--blue", "--green", "--cream"],
    protanopia: ["--yellow", "--orange", "--blue", "--green"],
    deuteranopia: ["--yellow", "--orange", "--blue", "--green"],
    tritanopia: ["--orange", "--green", "--cream"],
    acromatopsia: ["--yellow"],
  };
  document.querySelectorAll(".nav a").forEach((a) => {
    const sorteia = () => {
      const ok = cores[document.documentElement.dataset.tema || ""];
      a.style.setProperty("--nav-hover", `var(${ok[Math.floor(Math.random() * ok.length)]})`);
    };
    a.addEventListener("mouseenter", sorteia);
    a.addEventListener("focus", sorteia);
  });
}

// Toque: em tela sem hover (celular), tocar num item de [data-toque] liga o mesmo efeito do hover (classe .toque);
// tocar de novo, em outro item ou fora desliga.
if (matchMedia("(hover: none)").matches) {
  document.addEventListener("click", (e) => {
    const it = e.target.closest("[data-toque] > *");
    document.querySelectorAll(".toque").forEach((x) => { if (x !== it) x.classList.remove("toque"); });
    if (it) it.classList.toggle("toque");
  });
}

// Rodapé: cada hover sorteia uma cor da identidade visual (sem o grafite, que some no fundo).
{
  const cores = ["--yellow", "--orange", "--blue", "--green", "--pink"];
  document.querySelectorAll(".flinks a").forEach((a) => {
    const sorteia = () => a.style.setProperty("--hover", `var(${cores[Math.floor(Math.random() * cores.length)]})`);
    a.addEventListener("mouseenter", sorteia);
    a.addEventListener("focus", sorteia);
  });
}
})();
