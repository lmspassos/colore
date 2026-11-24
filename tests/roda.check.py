# Verificação da roda (moeda) entre /para-instituicoes-2/ e /para-educadores-2/.
# O giro acontece na mesma página (sem recarregar): seta, arraste (curto volta, longo troca) e o voltar do navegador.
# Confere também: sem erro de script, sem rolagem horizontal, um h1, título/endereço/menu/conteúdo trocados.
# Uso: servir a pasta do projeto (python3 -m http.server 8793) e rodar `python3 tests/roda.check.py`.
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8793"
ROT = "getComputedStyle(document.querySelector('.roda-w')).rotate"

def em(pg, caminho, graus):
    pg.wait_for_function(f"location.pathname === '{caminho}'", timeout=5000); pg.wait_for_timeout(1700)
    assert pg.evaluate("window.semRecarga === true"), "a página recarregou"
    assert pg.evaluate(ROT) in graus, f"roda em {pg.evaluate(ROT)}, esperado {graus}"
    assert pg.evaluate("document.querySelectorAll('h1').length") == 1
    lado = "educadores" if "educadores" in caminho else "instituicoes"
    assert pg.evaluate("document.querySelector('[data-roda]').dataset.lado") == lado
    assert pg.evaluate("document.querySelector('.roda-card h1').textContent") == ("Para educadores" if lado == "educadores" else "Para instituições")
    assert pg.evaluate("document.title").startswith("Para educadores 2" if lado == "educadores" else "Para instituições 2")
    assert pg.evaluate("document.querySelector('.nav a[aria-current=page]').getAttribute('href')") == caminho.rstrip("/")
    assert pg.evaluate("!!document.querySelector(%s)" % ("'#visita'" if lado == "educadores" else "'#formulario'")), "conteúdo de baixo não trocou"

with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={"width": w, "height": h}); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        for url in ("/para-instituicoes-2/", "/para-educadores-2/"):
            pg.goto(BASE + url); pg.wait_for_timeout(500)
            assert pg.evaluate("document.querySelectorAll('h1').length") == 1, f"um h1 em {url}"
            assert pg.evaluate("document.documentElement.scrollWidth") <= w, f"rolagem horizontal em {url} {w}px"
        pg.goto(BASE + "/para-instituicoes-2/"); pg.wait_for_timeout(800)
        pg.evaluate("window.semRecarga = true")
        y = h * .35
        # arraste curto: volta e não troca
        pg.mouse.move(w * .6, y); pg.mouse.down(); pg.mouse.move(w * .55, y, steps=5); pg.mouse.up(); pg.wait_for_timeout(1200)
        assert pg.evaluate("location.pathname") == "/para-instituicoes-2/" and pg.evaluate(ROT) in ("0deg", "none"), "arraste curto não voltou"
        # seta: vai para educadores sem recarregar
        pg.click(".roda-seta.prox"); em(pg, "/para-educadores-2/", ("-180deg", "180deg"))
        # arraste longo para a esquerda: volta para instituições
        pg.mouse.move(w * .85, y); pg.mouse.down(); pg.mouse.move(w * .25, y, steps=12); pg.mouse.up()
        em(pg, "/para-instituicoes-2/", ("-360deg", "0deg", "360deg"))
        # voltar do navegador: gira de volta para educadores
        pg.go_back(); em(pg, "/para-educadores-2/", ("-180deg", "180deg"))
        # o formulário de instituições continua funcionando depois de ir e voltar (validação do form.js)
        pg.go_forward(); em(pg, "/para-instituicoes-2/", ("-360deg", "0deg", "360deg"))
        pg.evaluate("document.querySelector('form[data-validar]').requestSubmit()"); pg.wait_for_timeout(200)
        assert pg.evaluate("location.pathname") == "/para-instituicoes-2/", "formulário vazio foi enviado"
        assert not erros, erros
    # sem JS a seta é um link comum
    ctx = b.new_context(java_script_enabled=False); pg = ctx.new_page()
    pg.goto(BASE + "/para-instituicoes-2/"); pg.click(".roda-seta.prox"); pg.wait_for_url("**/para-educadores-2/")
    print("ok")
