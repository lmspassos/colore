// Estações: baralho de cards que flui para a direita e avança sozinho (devagar),
// ao clique, arrastando ou pelas bolinhas. Sem JS ou com movimento reduzido, vira lista.
const track = document.querySelector(".deck-track");
if (track && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const stage = track.querySelector(".deck");
  const cards = [...stage.querySelectorAll(".card")], n = cards.length;
  const bolas = [...track.querySelectorAll(".deck-dots button")];
  let ativo = 0, ocupado = false, arrastando = false, ultimo = performance.now();
  track.classList.add("deck-on");

  // d = lugar no baralho: 0 na frente, os outros atrás, abertos à direita
  const pos = (c, i) => {
    const d = (i - ativo + n) % n;
    c.style.transform = `translateX(${d * Math.min(80, stage.offsetWidth * 0.16)}px) rotate(${2 * d}deg) scale(${Math.max(0.7, 1 - 0.05 * d)})`;
    c.style.opacity = 1;
    c.style.zIndex = 100 - d * 10;
  };
  const desenha = () => cards.forEach(pos);
  const marca = () => bolas.forEach((b, i) => {
    b.classList.toggle("on", i === ativo);
    if (i === ativo) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
  });
  const fora = () => `translateX(${-stage.offsetWidth * 1.3}px) rotate(-10deg)`; // à esquerda

  // sentido > 0: o card da frente sai pela esquerda e o novo vem de trás
  // sentido < 0: o novo entra pela esquerda e assume a frente
  const vai = (novo, sentido) => {
    if (ocupado || novo === ativo) return;
    ocupado = true;
    ultimo = performance.now();
    const antigo = cards[ativo], entra = cards[novo];
    ativo = novo;
    marca();
    if (sentido > 0) {
      cards.forEach((c, i) => { if (c !== antigo) pos(c, i); });
      antigo.style.transform = fora();
      antigo.style.opacity = 0;
      antigo.style.zIndex = 200;
      setTimeout(() => { // reaparece aos poucos no seu lugar do baralho
        antigo.style.transition = "none";
        pos(antigo, cards.indexOf(antigo));
        antigo.style.opacity = 0;
        void antigo.offsetWidth;
        antigo.style.transition = "";
        antigo.style.opacity = 1;
      }, 900);
    } else {
      entra.style.transition = "none";
      entra.style.transform = fora();
      entra.style.opacity = 0;
      entra.style.zIndex = 200;
      void entra.offsetWidth;
      entra.style.transition = "";
      desenha();
    }
    setTimeout(() => { ocupado = false; }, 950);
  };
  const avanca = () => vai((ativo + 1) % n, 1);
  const volta = () => vai((ativo - 1 + n) % n, -1);
  bolas.forEach((b, i) => b.addEventListener("click", () => vai(i, i > ativo ? 1 : -1)));

  // arrastar: para a esquerda avança, para a direita volta; um toque sem arrastar avança
  let x0 = null, dx = 0, moveu = false, alvo = null;
  stage.addEventListener("pointerdown", (e) => {
    alvo = e.target.closest(".card"); // guardado antes da captura do ponteiro
    if (e.button || ocupado) return;
    x0 = e.clientX; dx = 0; moveu = false; arrastando = true;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    if (Math.abs(dx) < 6) return;
    moveu = true;
    const f = cards[ativo];
    f.style.transition = "none";
    f.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
  });
  const solta = () => {
    if (x0 === null) return;
    x0 = null; arrastando = false;
    ultimo = performance.now();
    cards[ativo].style.transition = "";
    if (dx < -70) avanca(); else if (dx > 70) volta(); else pos(cards[ativo], ativo);
  };
  stage.addEventListener("pointerup", solta);
  stage.addEventListener("pointercancel", solta);
  // clicar num card de trás traz ele para a frente; no da frente, avança
  stage.addEventListener("click", () => {
    if (moveu) { moveu = false; return; }
    const i = cards.indexOf(alvo);
    vai(i >= 0 && i !== ativo ? i : (ativo + 1) % n, 1);
  });
  addEventListener("resize", desenha);

  // avanço automático: segue sozinho e recomeça a contar depois de qualquer interação
  setInterval(() => {
    if (!arrastando && !document.hidden && performance.now() - ultimo >= 5500) avanca();
  }, 500);
  desenha();
}
