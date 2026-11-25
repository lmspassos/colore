# Verificação da página /para-instituicoes/: sem erro de script, sem rolagem horizontal, módulos presentes, formulário presente.
# Uso: servir a pasta do projeto (python3 -m http.server 8793) e rodar `python3 tests/para-instituicoes.check.py`.
from playwright.sync_api import sync_playwright
URL = "http://localhost:8793/para-instituicoes/"
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={"width": w, "height": h}); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(800)
        assert not erros, erros
        assert pg.evaluate("document.documentElement.scrollWidth") <= w, f"rolagem horizontal em {w}px"
        for sel, n in ((".fl", 7), (".rg", 3), (".gcard", 4), (".stops li", 4), (".hstep", 4), ("details.qa", 5)):
            assert pg.evaluate(f"document.querySelectorAll('{sel}').length") == n, sel
        assert pg.evaluate("document.querySelector('#h-top').getAttribute('aria-label')") == "Receba a Colorê na sua instituição", "título com aria-label"
        assert pg.evaluate("document.querySelectorAll('form[data-validar] input, form[data-validar] textarea').length") >= 8, "formulário"
    print("ok")
