# Verificação da página /contato-2/: sem erro de script, sem rolagem horizontal, um h1,
# o assunto é escolhido uma vez só (balões do formulário), mascote se assusta com envio vazio e sorri com tudo preenchido.
# Uso: servir a pasta do projeto (python3 -m http.server 8793) e rodar `python3 tests/contato-2.check.py`.
from playwright.sync_api import sync_playwright
URL = "http://localhost:8793/contato-2/"
with sync_playwright() as p:
    b = p.chromium.launch(args=["--no-sandbox"])
    for w, h in ((1440, 900), (390, 844)):
        pg = b.new_page(viewport={"width": w, "height": h}); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(800)
        assert pg.evaluate("document.documentElement.scrollWidth") <= w, f"rolagem horizontal em {w}px"
        assert pg.evaluate("document.querySelectorAll('h1').length") == 1
        assert pg.evaluate("document.querySelector('#h-top').getAttribute('aria-label')") == "Vamos conversar?"
        assert pg.evaluate("document.querySelector('.nav a[aria-current=page]').getAttribute('href')") == "/contato-2"
        assert pg.evaluate("document.querySelectorAll('.chip.bolha input[name=tipo]').length") == 4, "balões de assunto"
        assert pg.evaluate("document.querySelectorAll('input[name=tipo]').length") == 4, "assunto repetido na página"
        assert pg.evaluate("document.querySelectorAll('.dir2').length") == 3
        # envio vazio: barrado, com mensagens em texto e mascote assustado
        pg.evaluate("document.querySelector('#formulario form').requestSubmit()"); pg.wait_for_timeout(150)
        assert pg.evaluate("location.pathname") == "/contato-2/", "formulário vazio foi enviado"
        assert pg.evaluate("document.querySelector('.masc').classList.contains('ops')"), "mascote não reagiu ao erro"
        assert pg.evaluate("[...document.querySelectorAll('.emsg')].some(e => !e.hidden)"), "sem mensagem de erro"
        # o botão da abertura leva ao formulário; o balão do formulário marca o assunto
        pg.click(".c2-cta"); pg.wait_for_timeout(500)
        assert pg.evaluate("location.hash") == "#formulario"
        pg.click(".chip.bolha:has(input[value=educador])", force=True)  # force: o balão ainda pode estar estourando na entrada
        pg.wait_for_timeout(200)
        assert pg.evaluate("document.querySelector('input[name=tipo][value=educador]').checked"), "balão não marcou o tipo"
        # tudo preenchido: mascote sorri
        pg.fill("#c-nome", "Ana"); pg.fill("#c-email", "ana@escola.org"); pg.fill("#c-msg", "Olá!"); pg.check("#c-lgpd")
        pg.wait_for_timeout(100)
        assert pg.evaluate("document.querySelector('.masc').classList.contains('ok')"), "mascote não sorriu"
        assert not erros, erros
    print("ok")
