# Verificação da roda (moeda) entre /para-instituicoes-2/ e /para-educadores-2/:
# sem erro de script, sem rolagem horizontal, um h1 por página, setas levam à outra página e a roda termina na metade certa.
# Uso: servir a pasta do projeto (python3 -m http.server 8793) e rodar `python3 tests/roda.check.py`.
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8793"
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={"width": w, "height": h}); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        for url, lado, outro in (("/para-instituicoes-2/", "instituicoes", "/para-educadores-2/"), ("/para-educadores-2/", "educadores", "/para-instituicoes-2/")):
            pg.goto(BASE + url); pg.wait_for_timeout(500)
            assert pg.evaluate("document.querySelectorAll('h1').length") == 1, f"um h1 em {url}"
            assert pg.evaluate("document.documentElement.scrollWidth") <= w, f"rolagem horizontal em {url} {w}px"
            assert pg.evaluate(f"document.querySelector('[data-roda]').dataset.lado") == lado
            assert pg.evaluate("[...document.querySelectorAll('.roda-seta')].every(a => a.getAttribute('href') === '%s')" % outro)
        # clicar na seta abre a outra página e a roda gira até a metade dela (180deg = educadores no topo)
        pg.goto(BASE + "/para-instituicoes-2/"); pg.click(".roda-seta.prox"); pg.wait_for_url("**/para-educadores-2/"); pg.wait_for_timeout(1800)
        assert pg.evaluate("getComputedStyle(document.querySelector('.roda-w')).rotate") == "180deg", "roda parou na metade errada"
        assert pg.evaluate("document.querySelector('.roda').classList.contains('gira')"), "a roda não girou"
        assert not erros, erros
    print("ok")
