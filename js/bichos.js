// Bichinhos do rodapé: andam, pulam, olham o mouse, visitam uns aos outros e podem ser pegos e soltos.
(() => {
  const area = document.querySelector(".ftr-dots");
  if (!area || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ftr = area.closest(".ftr"), chao = ftr.querySelector(".ftr-b");
  const G = 1500, rnd = (a, b) => a + Math.random() * (b - a), lim = (v, a, b) => Math.max(a, Math.min(b, v));
  let W = 0, yMax = 0, ar, ponto = null, mouse = { cx: 0, cy: 0, ok: false, t: -9 }, tempo = 0;

  area.classList.add("viva");
  const bs = [...area.querySelectorAll(".bicho")].map((el) => ({
    el, b: el.querySelector("b"), s: el.querySelector("s"), x: 0, y: 0, vx: 0, vy: 0, f: Math.random() < .5 ? 1 : -1, fs: 0,
    est: "parado", t: rnd(.3, 2), k: 0, kv: 0, kt: 0, sw: 0, fase: rnd(0, 6), alvo: 0, seguir: false, vh: 0, v: 0, cool: 0,
  }));
  bs.forEach((c) => { c.fs = c.f; });

  function medir() {
    const r = ftr.getBoundingClientRect(), old = yMax;
    W = r.width; yMax = chao.getBoundingClientRect().top - r.top - bs[0].el.offsetHeight;
    bs.forEach((c) => {
      c.w = c.el.offsetWidth; c.h = c.el.offsetHeight;
      c.x = lim(c.x, 0, W - c.w);
      if (c.est === "arrasta") return;
      if (c.y >= old - 1 || c.y > yMax) c.y = yMax; else if (c.est !== "ar") c.est = "ar";
    });
  }
  medir();
  bs.forEach((c, i) => { c.x = lim((W / bs.length) * (i + .5) - c.w / 2, 0, W - c.w); c.y = yMax; });
  new ResizeObserver(medir).observe(ftr);

  function pula(c, forte) { c.est = "agacha"; c.t = .13; c.v = forte ? rnd(420, 500) : rnd(320, 400); c.vh = c.f * rnd(30, 110); }

  function escolher(c) {
    const cx = c.x + c.w / 2, perto = ponto && Math.abs(ponto.x - cx) < 450, r = Math.random();
    const outros = bs.filter((o) => o !== c && o.est !== "arrasta");
    c.t = rnd(1, 3);
    if (perto && r < .6) {
      const lado = Math.sign(ponto.x - cx) || 1;
      c.alvo = lim(ponto.x - c.w / 2 - lado * 70, 0, W - c.w);
      if (Math.abs(c.alvo - c.x) < 25) { c.f = lado; return pula(c, true); }
      c.est = "anda"; c.vel = rnd(55, 85); c.depois = null;
    } else if (r < .45 && outros.length) {
      const o = outros[Math.floor(Math.random() * outros.length)], lado = Math.sign(c.x - o.x) || 1;
      c.alvo = lim(o.x + lado * (c.w + 10), 0, W - c.w); c.est = "anda"; c.vel = rnd(35, 60); c.depois = o; c.lado = lado;
    } else if (r < .65) pula(c, false);
    else if (r < .9) { c.alvo = rnd(0, W - c.w); c.est = "anda"; c.vel = rnd(30, 60); c.depois = null; }
    else c.f = -c.f;
  }

  function passo(c, dt) {
    const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
    const dentro = ponto && ponto.y > -40 && ponto.y < yMax + c.h + 80 && ponto.x > -40 && ponto.x < W + 40;
    const dx = dentro ? ponto.x - cx : 0, perto = dentro && Math.abs(dx) < 420;
    c.kt = 0; let bob = 0, tilt = 0, alvoSw = 0;

    if (c.est === "parado") {
      c.t -= dt;
      if (perto && Math.abs(dx) > 25) c.f = Math.sign(dx);
      if (perto && tempo - mouse.t < .4 && c.t > .6) c.t = rnd(.2, .7);
      if (perto && Math.random() < dt * .35) pula(c, false);
      if (c.t <= 0 && c.est === "parado") escolher(c);
    } else if (c.est === "anda") {
      const d = c.alvo - c.x, passoPx = c.vel * dt;
      c.f = Math.sign(d) || c.f;
      if (Math.abs(d) <= passoPx) {
        c.x = c.alvo; c.est = "parado"; c.t = rnd(1.5, 3.5); c.seguir = false;
        if (c.depois) {
          const o = c.depois; c.f = -c.lado; o.f = c.lado; c.depois = null;
          if (o.est === "parado" && Math.random() < .7) { pula(o, false); o.t = .13 + rnd(.1, .4); }
        }
      } else {
        c.x += c.f * passoPx; c.fase += passoPx * .22;
        alvoSw = Math.sin(c.fase) * 32; bob = -Math.abs(Math.sin(c.fase)) * 3; tilt = Math.sin(c.fase) * 2.5;
        if (Math.random() < dt * .3) { c.seguir = true; pula(c, false); }
      }
    } else if (c.est === "agacha") {
      c.kt = .2; c.t -= dt;
      if (c.t <= 0) { c.vy = -c.v; c.vx = c.vh; c.est = "ar"; c.k = -.16; c.kv = 0; }
    } else if (c.est === "ar") {
      c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; alvoSw = 22; tilt = lim(c.vx * .03, -12, 12);
      if (c.x < 0 || c.x > W - c.w) { c.x = lim(c.x, 0, W - c.w); c.vx *= -.5; c.f = Math.sign(c.vx) || c.f; }
      if (c.y < 0) { c.y = 0; c.vy = Math.abs(c.vy) * .3; }
      if (c.y >= yMax && c.vy > 0) {
        c.y = yMax; c.k = lim(.12 + c.vy / 2500, .15, .3); c.kv = 0; c.vx = 0;
        if (c.seguir) c.est = "anda"; else { c.est = "parado"; c.t = rnd(.4, 1.8); }
      }
    } else if (c.est === "arrasta") {
      const nx = c.x + (c.tx - c.x) * Math.min(1, dt * 30), ny = c.y + (c.ty - c.y) * Math.min(1, dt * 30);
      c.vx += ((nx - c.x) / dt - c.vx) * .3; c.vy += ((ny - c.y) / dt - c.vy) * .3; c.x = nx; c.y = ny;
      alvoSw = Math.sin(tempo * 14 + c.fase) * 30; tilt = lim(c.vx * .04, -25, 25);
      if (Math.abs(c.vx) > 40) c.f = Math.sign(c.vx);
    }
    c.sw += (alvoSw - c.sw) * Math.min(1, dt * 18);
    c.fs += (c.f - c.fs) * Math.min(1, dt * 9);
    c.kv += (-160 * (c.k - c.kt) - 12 * c.kv) * dt; c.k += c.kv * dt;
    const resp = c.est === "parado" ? Math.sin(tempo * 2.4 + c.fase) * .015 : 0;
    const olhaX = dentro ? lim(dx / 90, -1, 1) : 0, olhaY = dentro ? lim((ponto.y - cy) / 50, -1, 1) : 0;
    const e = c.el.style, alt = Math.max(0, yMax - c.y);
    e.translate = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px`;
    e.setProperty("--sw", c.sw.toFixed(1)); e.setProperty("--f", c.fs.toFixed(2));
    e.setProperty("--lx", (c.fs * 3 + olhaX * 1.6).toFixed(2)); e.setProperty("--ly", (olhaY * 1.8).toFixed(2));
    c.b.style.scale = `${(1 + c.k).toFixed(3)} ${(1 - c.k + resp).toFixed(3)}`;
    c.b.style.rotate = `${tilt.toFixed(1)}deg`; c.b.style.translate = `0 ${bob.toFixed(1)}px`;
    c.s.style.translate = `0 ${alt.toFixed(1)}px`; c.s.style.scale = Math.max(.35, 1 - alt / 200).toFixed(2);
    c.s.style.opacity = Math.max(.3, 1 - alt / 250).toFixed(2);
  }

  let ult = 0, rodando = false, vis = true;
  function quadro(agora) {
    if (!rodando) return;
    const dt = Math.min((agora - ult) / 1000, .05) || .016; ult = agora; tempo = agora / 1000;
    ar = area.getBoundingClientRect();
    ponto = mouse.ok ? { x: mouse.cx - ar.left, y: mouse.cy - ar.top } : null;
    bs.forEach((c) => passo(c, dt));
    requestAnimationFrame(quadro);
  }
  function ajusta() {
    const quer = vis && !document.hidden;
    if (quer && !rodando) { rodando = true; ult = performance.now(); requestAnimationFrame(quadro); } else if (!quer) rodando = false;
  }
  new IntersectionObserver((en) => { vis = en[0].isIntersecting; ajusta(); }).observe(ftr);
  document.addEventListener("visibilitychange", ajusta);

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") { mouse.cx = e.clientX; mouse.cy = e.clientY; mouse.ok = true; mouse.t = tempo; }
    const c = bs.find((o) => o.est === "arrasta" && o.id === e.pointerId);
    if (!c) return;
    const r = area.getBoundingClientRect();
    c.tx = lim(e.clientX - r.left - c.gx, 0, W - c.w); c.ty = lim(e.clientY - r.top - c.gy, 0, yMax);
  });
  document.documentElement.addEventListener("pointerleave", () => { mouse.ok = false; });

  bs.forEach((c) => {
    const solta = (e) => {
      if (c.est !== "arrasta" || e.pointerId !== c.id) return;
      c.el.classList.remove("arrasta", "pega"); c.vx = lim(c.vx, -650, 650); c.vy = lim(c.vy, -650, 650);
      c.est = "ar"; c.seguir = false; c.depois = null;
    };
    c.el.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return;
      e.preventDefault(); c.el.setPointerCapture(e.pointerId);
      const r = area.getBoundingClientRect();
      c.id = e.pointerId; c.est = "arrasta"; c.gx = e.clientX - r.left - c.x; c.gy = e.clientY - r.top - c.y;
      c.tx = c.x; c.ty = c.y; c.vx = c.vy = 0; c.el.classList.add("arrasta", "pega");
    });
    c.el.addEventListener("pointerup", solta); c.el.addEventListener("pointercancel", solta);
    c.el.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse" && (c.est === "parado" || c.est === "anda") && tempo - c.cool > 3) { c.cool = tempo; c.seguir = c.est === "anda"; pula(c, false); }
    });
  });
  ajusta();
})();
