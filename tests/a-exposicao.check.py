# Verificação da página /a-exposicao/: sem erro de script, sem rolagem horizontal, títulos mantêm o texto, baralho montado.
# Uso: servir a pasta do projeto (python3 -m http.server 8793) e rodar `python3 tests/a-exposicao.check.py`.
from playwright.sync_api import sync_playwright
URL = "http://localhost:8793/a-exposicao/"
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={"width": w, "height": h}); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(800)
        assert not erros, erros
        assert pg.evaluate("document.documentElement.scrollWidth") <= w, f"rolagem horizontal em {w}px"
        assert pg.evaluate("document.querySelectorAll('.objs.deck .obj').length") == 6, "baralho"
        assert pg.evaluate("document.querySelector('.intro-h').textContent.includes('Cada pessoa vê o mundo do seu jeito')")
        assert pg.evaluate("document.querySelectorAll('.gw:not([aria-hidden=true])').length") == 0, "letras expostas ao leitor de tela"
    print("ok")
