// Busca: lê ?q= e consulta o índice do Pagefind (pasta /pagefind, gerada com `npx pagefind --site .`).
const q = new URLSearchParams(location.search).get("q")?.trim();
const status = document.getElementById("status");
const list = document.getElementById("results");
if (q) {
  document.getElementById("bq").value = q;
  try {
    const pf = await import("/pagefind/pagefind.js");
    await pf.options({ language: document.documentElement.lang.toLowerCase() });
    const { results } = await pf.search(q);
    status.textContent = results.length ? `${results.length} resultado(s) para “${q}”` : `Nenhum resultado para “${q}”.`;
    for (const r of results.slice(0, 20)) {
      const d = await r.data();
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "/" + d.url.replace(/^\//, "");
      a.textContent = d.meta.title;
      const p = document.createElement("p");
      p.innerHTML = d.excerpt; // trecho vindo do nosso próprio índice (<mark>)
      li.append(a, p);
      list.append(li);
    }
  } catch {
    status.textContent = "Não foi possível carregar a busca agora. Tente novamente mais tarde.";
  }
}
