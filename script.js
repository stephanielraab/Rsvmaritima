/* ==========================================================
   RSV CONSULTORIA - SCRIPT
   Preenche o site com os dados de conteudo.js.
   ========================================================== */
(function () {
  'use strict';

  var C = window.CONTEUDO;
  if (!C) {
    console.error('conteudo.js não foi carregado. Verifique o nome e a pasta do arquivo.');
    return;
  }

  function $(id) { return document.getElementById(id); }

  function criarEl(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function linkWhats(numero, mensagem) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem);
  }

  var numeroPrincipal = C.contato.whatsapp[0].numero;
  var linkGeral = linkWhats(numeroPrincipal, C.hero.mensagemWhatsApp);

  /* ---------- TEXTOS FIXOS ---------- */
  function preencherTextos() {
    document.title = C.empresa.nome;

    $('hero-kicker').textContent = C.hero.kicker;
    $('hero-titulo').textContent = C.hero.titulo;
    $('hero-texto').textContent = C.hero.texto;

    $('missao-texto').textContent = C.missao;
    $('visao-texto').textContent = C.visao;

    var foto = $('sobre-foto');
    foto.src = C.sobre.foto;
    foto.alt = C.sobre.fotoAlt;
    foto.addEventListener('error', function () { foto.style.display = 'none'; });
    $('sobre-nome').textContent = C.sobre.nome;
    $('sobre-texto').textContent = C.sobre.texto;

    $('curso-titulo').textContent = C.curso.titulo;
    $('curso-texto').textContent = C.curso.texto;
    $('curso-botao').href = linkWhats(numeroPrincipal, C.curso.mensagem);

    $('contato-email').href = 'mailto:' + C.contato.email;
    $('contato-email').textContent = C.contato.email;

    $('rodape-nome').textContent = C.empresa.nome;
    $('rodape-email').href = 'mailto:' + C.contato.email;
    $('rodape-email').textContent = C.contato.email;

    $('hero-whats').href = linkGeral;
    $('menu-whatsapp').href = linkGeral;
    $('whats-flutuante').href = linkGeral;
  }

  /* ---------- SERVIÇOS ---------- */
  function renderServicos() {
    var lista = $('servicos-lista');
    C.servicos.forEach(function (cat, i) {
      var card = criarEl('article', 'card reveal');
      card.appendChild(criarEl('span', 'num', String(i + 1).padStart(2, '0')));
      card.appendChild(criarEl('h3', '', cat.titulo));
      var ul = criarEl('ul');
      cat.itens.forEach(function (item) { ul.appendChild(criarEl('li', '', item)); });
      card.appendChild(ul);
      lista.appendChild(card);
    });
  }

  /* ---------- VALORES ---------- */
  function renderValores() {
    var lista = $('valores-lista');
    C.valores.forEach(function (v, i) {
      var card = criarEl('article', 'card reveal');
      card.appendChild(criarEl('span', 'num', String(i + 1)));
      card.appendChild(criarEl('h3', '', v.titulo));
      card.appendChild(criarEl('p', '', v.texto));
      lista.appendChild(card);
    });
  }

  /* ---------- CURSO ---------- */
  function renderCurso() {
    var ul = $('curso-destaques');
    C.curso.destaques.forEach(function (d) { ul.appendChild(criarEl('li', '', d)); });
  }

  /* ---------- CONTATO ---------- */
  function renderContato() {
    var box = $('contato-whatsapp');
    C.contato.whatsapp.forEach(function (w) {
      var a = criarEl('a', 'contato-item', 'WhatsApp: ' + w.exibir);
      a.href = linkWhats(w.numero, C.hero.mensagemWhatsApp);
      a.target = '_blank';
      a.rel = 'noopener';
      box.appendChild(a);
    });

    var select = $('assunto');
    var opcao = criarEl('option', '', 'Selecione um assunto');
    opcao.value = '';
    select.appendChild(opcao);
    C.contato.assuntos.forEach(function (t) {
      var o = criarEl('option', '', t);
      o.value = t;
      select.appendChild(o);
    });
  }

  /* ---------- RODAPÉ: WHATSAPP ---------- */
  function renderRodapeWhats() {
    var box = $('rodape-whats');
    C.contato.whatsapp.forEach(function (w) {
      var a = criarEl('a', 'rodape-link', 'WhatsApp: ' + w.exibir);
      a.href = linkWhats(w.numero, C.hero.mensagemWhatsApp);
      a.target = '_blank';
      a.rel = 'noopener';
      box.appendChild(a);
    });
  }

  /* ---------- REDES SOCIAIS (seção Sobre e rodapé) ---------- */
  function renderRedes() {
    ['sobre-redes', 'rodape-redes'].forEach(function (id) {
      var box = $(id);
      if (!box) return;
      C.redes.forEach(function (r) {
        var a = criarEl('a', 'rede', r.nome);
        a.href = r.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', 'Abrir ' + r.nome + ' do Comandante Ricardo Vieira');
        box.appendChild(a);
      });
    });
  }

  /* ---------- MENU MOBILE E CABEÇALHO ---------- */
  function iniciarMenu() {
    var topo = $('topo');
    var btn = $('menu-btn');
    var menu = $('menu');

    btn.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', String(aberto));
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('aberto');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('scroll', function () {
      topo.classList.toggle('rolou', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- ANIMAÇÃO AO ROLAR ---------- */
  function iniciarAnimacoes() {
    var itens = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      itens.forEach(function (el) { el.classList.add('visivel'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visivel');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- FORMULÁRIO ---------- */
  function iniciarFormulario() {
    var form = $('contato-form');
    var retorno = $('form-retorno');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      retorno.textContent = '';
      retorno.className = 'form-retorno';

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var botao = form.querySelector('button[type="submit"]');
      botao.disabled = true;
      botao.textContent = 'Enviando...';

      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function (resp) { return resp.json(); })
        .then(function (dados) {
          if (!dados.ok) throw new Error(dados.mensagem);
          retorno.textContent = dados.mensagem;
          retorno.classList.add('sucesso');
          form.reset();
        })
        .catch(function () {
          retorno.textContent = 'Não foi possível enviar agora. Tente pelo WhatsApp ou pelo e-mail ' + C.contato.email + '.';
          retorno.classList.add('erro');
        })
        .then(function () {
          botao.disabled = false;
          botao.textContent = 'Enviar mensagem';
        });
    });
  }
    /* ---------- FORMAÇÃO DO COMANDANTE ---------- */
  function renderFormacao() {
    if (!C.sobre.formacao || !C.sobre.formacao.length) return;
    var ul = criarEl('ul', 'sobre-formacao');
    C.sobre.formacao.forEach(function (f) { ul.appendChild(criarEl('li', '', f)); });
    $('sobre-texto').insertAdjacentElement('afterend', ul);
  }



  /* ---------- INÍCIO ---------- */
  preencherTextos();
  renderServicos();
  renderValores();
  renderCurso();
  renderContato();
  renderRodapeWhats();
  renderRedes();
  iniciarMenu();
  iniciarFormulario();
  iniciarAnimacoes();
  renderFormacao();
})();
