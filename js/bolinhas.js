// Fechamento da home: bolinhas coloridas com gravidade que se pode segurar, arrastar e arremessar.
// Sem JS ou com movimento reduzido ficam as bolinhas estáticas (decoração: fora da árvore de acessibilidade).
(() => {
  const arte = document.querySelector(".close-art");
  if (!arte) return;
  const parado = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // diâmetro (fração do menor lado da seção) e cor; a cor verde fica de fora porque é a do fundo
  const TAM = [.28, .24, .22, .2, .2, .18, .18, .16, .16, .15, .14, .14, .13, .12, .12, .11, .1, .1, .09, .09, .08, .08, .07, .07];
  const COR = ["--yellow", "--pink", "--orange", "--blue", "--cream"];
  const ESPEC = [...TAM, ...TAM.slice(2, 18)].map((d, i) => [d, COR[(i * 3 + (i > 23 ? 1 : 0)) % COR.length]]);
  const G = 2200, E_PAREDE = .45, E_BOLA = .4, VMAX = 2200;
  arte.closest(".close").prepend(arte); // a área de física ocupa a seção verde inteira, por trás do texto
  arte.classList.add("pit");
  let W = arte.clientWidth, H = arte.clientHeight, arrasto = null, raf = 0, t0 = 0, visivel = false;

  arte.replaceChildren();
  const U = Math.min(W, H);
  const bolas = ESPEC.map(([d, cor], i) => {
    const el = document.createElement("span"), r = d * U / 2;
    el.style.background = `var(${cor})`;
    el.style.width = el.style.height = 2 * r + "px";
    arte.append(el);
    const dentro = parado;
    return { el, r, dentro, x: r + Math.random() * (W - 2 * r), y: parado ? r + Math.random() * (H / 2) : -r - i * H * .04, vx: 0, vy: 0, m: r * r };
  });

  const desenha = () => bolas.forEach((b) => { b.el.style.transform = `translate(${b.x - b.r}px,${b.y - b.r}px)`; });

  const passo = (dt) => {
    for (const b of bolas) {
      if (arrasto && arrasto.b === b) { b.vx = (arrasto.tx - b.x) * 28; b.vy = (arrasto.ty - b.y) * 28; } // a bolinha segurada persegue o ponteiro
      else b.vy += G * dt;
      const v = Math.hypot(b.vx, b.vy);
      if (v > VMAX) { b.vx *= VMAX / v; b.vy *= VMAX / v; }
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * E_PAREDE; }
      else if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * E_PAREDE; }
      if (b.y > H - b.r) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * E_PAREDE; b.vx *= .99; }
      else if (b.y >= b.r) b.dentro = true;
      else if (b.dentro) { b.y = b.r; b.vy = Math.abs(b.vy) * E_PAREDE; } // o teto só vale depois que a bolinha entrou
    }
    for (let i = 0; i < bolas.length; i++) for (let j = i + 1; j < bolas.length; j++) {
      const a = bolas[i], b = bolas[j], dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r, d2 = dx * dx + dy * dy;
      if (d2 >= min * min || d2 === 0) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ia = arrasto && arrasto.b === a ? 0 : 1 / a.m, ib = arrasto && arrasto.b === b ? 0 : 1 / b.m, s = ia + ib;
      if (!s) continue;
      const sobra = min - d;
      a.x -= nx * sobra * ia / s; a.y -= ny * sobra * ia / s; b.x += nx * sobra * ib / s; b.y += ny * sobra * ib / s;
      const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn < 0) { const j2 = -(1 + E_BOLA) * vn / s; a.vx -= j2 * ia * nx; a.vy -= j2 * ia * ny; b.vx += j2 * ib * nx; b.vy += j2 * ib * ny; }
    }
  };

  if (parado) { for (let k = 0; k < 900; k++) passo(1 / 120); desenha(); return; }

  const quadro = (t) => {
    const dt = Math.min(.033, (t - t0) / 1000 || .016);
    t0 = t;
    for (let k = 0; k < 3; k++) passo(dt / 3);
    desenha();
    // dorme quando tudo assentou, para não gastar processamento à toa
    raf = visivel && (arrasto || bolas.some((b) => !b.dentro || Math.hypot(b.vx, b.vy) > 30)) ? requestAnimationFrame(quadro) : 0;
  };
  const acorda = () => { if (!raf && visivel) { t0 = performance.now(); raf = requestAnimationFrame(quadro); } };

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; acorda(); }, { threshold: .25 }).observe(arte);
  new ResizeObserver(() => {
    const w = arte.clientWidth, s = w / W;
    if (!w || s === 1) return;
    const h = arte.clientHeight;
    bolas.forEach((b) => { b.x *= s; b.y = h - (H - b.y) * s; b.r *= s; b.m = b.r * b.r; b.el.style.width = b.el.style.height = 2 * b.r + "px"; });
    W = w; H = h; desenha(); acorda();
  }).observe(arte);

  const ponto = (e) => { const r = arte.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  arte.addEventListener("pointerdown", (e) => {
    const b = bolas.find((x) => x.el === e.target);
    if (!b) return;
    const [px, py] = ponto(e);
    arrasto = { b, ox: b.x - px, oy: b.y - py, tx: b.x, ty: b.y };
    arte.setPointerCapture(e.pointerId);
    arte.classList.add("agarra");
    acorda();
  });
  arte.addEventListener("pointermove", (e) => {
    if (!arrasto) return;
    const [px, py] = ponto(e), r = arrasto.b.r;
    arrasto.tx = Math.min(W - r, Math.max(r, px + arrasto.ox));
    arrasto.ty = Math.min(H - r, Math.max(r, py + arrasto.oy));
  });
  const solta = () => { arrasto = null; arte.classList.remove("agarra"); acorda(); };
  arte.addEventListener("pointerup", solta);
  arte.addEventListener("pointercancel", solta);
})();
