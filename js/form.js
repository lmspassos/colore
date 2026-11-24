// Formulários (contato e para instituições): validação com mensagens em texto e máscara de telefone.
// Sem JS vale a validação nativa (required). O envio continua simulado: GET para /obrigado.
(() => {
  document.querySelectorAll("form[data-validar]").forEach((form) => {
    form.noValidate = true;
    const campo = (n) => form.elements[n];
    const valor = (n) => { const c = campo(n); return !c ? "" : c.type === "checkbox" ? c.checked : (c.value || "").trim(); };
    const tipo = () => { const r = form.querySelector("[name=tipo]:checked"); return r ? r.value : ""; };
    const msg = {
      tipo: "Escolha o tipo de contato.", nome: "Informe seu nome.", email: "Informe um e-mail.",
      instituicao: "Informe o nome da instituição.", cidade: "Informe a cidade e o estado.",
      mensagem: "Escreva uma breve mensagem.", lgpd: "É preciso concordar com a Política de Privacidade.",
    };
    // cidade só é obrigatória para quem quer receber a exposição (contato) ou sempre (instituições)
    const cidadeObrigatoria = () => form.dataset.cidade === "sempre" || tipo() === "receber";
    const erro = (n) => {
      if (n === "tipo") return !tipo() ? msg.tipo : "";
      if (n === "cidade") return cidadeObrigatoria() && !valor(n) ? msg.cidade : "";
      if (n === "instituicao") return form.dataset.instituicao === "obrigatoria" && tipo() !== "Outro" && !valor(n) ? msg.instituicao : "";
      if (!campo(n) || !campo(n).required) return "";
      if (!valor(n)) return msg[n] || "Preencha este campo.";
      if (n === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor(n))) return "Confira o e-mail: ele parece incompleto.";
      return "";
    };
    const mostra = (n, texto) => {
      const dono = n === "tipo" ? form.querySelector(".chips") : campo(n);
      const p = form.querySelector(`[data-erro="${n}"]`);
      if (!dono || !p) return;
      p.textContent = texto;
      p.hidden = !texto;
      if (n === "tipo") return;
      dono.classList.toggle("err", !!texto);
      dono.setAttribute("aria-invalid", !!texto);
    };
    const nomes = [...new Set([...form.querySelectorAll("[data-erro]")].map((p) => p.dataset.erro))];
    form.addEventListener("submit", (e) => {
      let primeiro = null;
      nomes.forEach((n) => { const t = erro(n); mostra(n, t); if (t && !primeiro) primeiro = n === "tipo" ? form.querySelector("[name=tipo]") : campo(n); });
      if (primeiro) { e.preventDefault(); primeiro.focus(); }
    });
    form.addEventListener("input", (e) => {
      const c = e.target;
      if (c.name === "telefone") {
        const d = c.value.replace(/\D/g, "").slice(0, 11);
        c.value = d.length > 7 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
      }
      if (nomes.includes(c.name)) mostra(c.name, "");
      if (c.name === "tipo") { mostra("cidade", ""); const rot = form.querySelector("[data-cidade-rotulo]"); if (rot) rot.hidden = !cidadeObrigatoria(); const op = form.querySelector("[data-cidade-opcional]"); if (op) op.hidden = cidadeObrigatoria(); }
    });
    form.addEventListener("change", (e) => { if (e.target.name === "lgpd" || e.target.name === "tipo") mostra(e.target.name, ""); });
  });
})();
