/* =========================================================
   TELLES BARBERSHOP — comportamento do site
   ---------------------------------------------------------
   CONFIGURAÇÃO RÁPIDA:
   - WHATSAPP_NUMERO: substitua pelo número real da barbearia
     formato: 55 + DDD + número (sem espaços nem traços)
   - Mensagens: edite os textos nos atributos data-zap
     dos botões dentro dos arquivos .html
   ========================================================= */

const WHATSAPP_NUMERO = "5561999999999"; // ⚠️ SUBSTITUIR pelo número real
const WHATSAPP_PRE_DEFINIDO = true;      // false = botão vira link tel: (sem número)
const TELEFONO_FALLBACK = "tel:+556199999999";

/* ---------- Helpers ---------- */
function linkWhatsApp(mensagem) {
  if (!WHATSAPP_PRE_DEFINIDO) return TELEFONO_FALLBACK;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/* ---------- Ícones compartilhados (SVG inline) ---------- */
const ICONES = {
  zap: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7a11 11 0 0 0 4.2 3.7c.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.4z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  lupa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  esq: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg>`,
  dir: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  fechar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`
};

/* ---------- Botões de WhatsApp ---------- */
function iniciarLinksZap() {
  document.querySelectorAll("[data-zap]").forEach((el) => {
    el.href = linkWhatsApp(el.dataset.zap);
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });
}

/* ---------- Cabeçalho: menu mobile + sombra ---------- */
function iniciarHeader() {
  const header = document.querySelector(".site-header");
  const botao = document.getElementById("btn-menu");
  const nav = document.getElementById("nav-principal");

  function fechar() {
    nav?.classList.remove("aberto");
    botao?.setAttribute("aria-expanded", "false");
    botao?.setAttribute("aria-label", "Abrir menu");
  }

  botao?.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", fechar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fechar();
  });

  document.addEventListener("click", (e) => {
    if (!nav?.classList.contains("aberto")) return;
    if (!nav.contains(e.target) && !botao?.contains(e.target)) fechar();
  });

  const atualizarSombra = () => header?.classList.toggle("sombra", window.scrollY > 8);
  window.addEventListener("scroll", atualizarSombra, { passive: true });
  atualizarSombra();
}

/* ---------- Animação de entrada (discreta) ---------- */
function iniciarRevelar() {
  const itens = document.querySelectorAll(".revelar");
  if (!itens.length) return;

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    itens.forEach((el) => el.classList.add("visivel"));
    return;
  }

  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  itens.forEach((el) => obs.observe(el));
}

/* ---------- Galeria: lightbox ---------- */
function iniciarGaleria() {
  const itens = Array.from(document.querySelectorAll(".galeria-item"));
  if (!itens.length) return;

  const lightbox = document.getElementById("lightbox");
  const figuraImg = document.getElementById("lightbox-img");
  const legenda = document.getElementById("lightbox-legenda");
  const btnFechar = document.getElementById("lightbox-fechar");
  const btnAnt = document.getElementById("lightbox-ant");
  const btnProx = document.getElementById("lightbox-prox");

  // Sem lightbox na página (ex.: prévia na home com links para galeria.html),
  // injeta um ícone de "abrir" em vez do ícone de zoom.
  if (!lightbox || !figuraImg || !btnFechar || !btnAnt || !btnProx) {
    const iconeAbrir = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`;
    itens.forEach((item) => {
      const icone = document.createElement("span");
      icone.className = "galeria-item__lupa";
      icone.innerHTML = iconeAbrir;
      icone.setAttribute("aria-hidden", "true");
      item.appendChild(icone);
    });
    return;
  }

  let atual = 0;
  let ultimoFoco = null;

  function mostrar(index) {
    atual = (index + itens.length) % itens.length;
    const item = itens[atual];
    const img = item.querySelector("img");
    figuraImg.src = img.src;
    figuraImg.alt = img.alt;
    legenda.textContent = item.dataset.legenda || img.alt;
  }

  function abrir(index) {
    ultimoFoco = document.activeElement;
    mostrar(index);
    lightbox.classList.add("aberto");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnFechar.focus();
  }

  function fechar() {
    lightbox.classList.remove("aberto");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    ultimoFoco?.focus();
  }

  itens.forEach((item, i) => {
    // Ícone de lupa injetado em cada miniatura
    const lupa = document.createElement("span");
    lupa.className = "galeria-item__lupa";
    lupa.innerHTML = ICONES.lupa;
    lupa.setAttribute("aria-hidden", "true");
    item.appendChild(lupa);

    item.addEventListener("click", () => abrir(i));
  });

  btnFechar.innerHTML = ICONES.fechar;
  btnAnt.innerHTML = ICONES.esq;
  btnProx.innerHTML = ICONES.dir;

  btnFechar.addEventListener("click", fechar);
  btnAnt.addEventListener("click", () => mostrar(atual - 1));
  btnProx.addEventListener("click", () => mostrar(atual + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fechar();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
}

/* ---------- Formulário de contato ---------- */
function iniciarFormulario() {
  const form = document.getElementById("form-contato");
  if (!form) return;

  const sucesso = document.getElementById("form-sucesso");
  const btnZap = document.getElementById("sucesso-zap");

  const regras = {
    nome: (v) => v.trim().length >= 2 || "Informe seu nome.",
    whatsapp: (v) => (/^[\d\s()+.-]{10,}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 10)
      || "Informe um telefone válido com DDD.",
    mensagem: (v) => v.trim().length >= 10 || "Escreva uma mensagem com pelo menos 10 caracteres."
  };

  function validarCampo(campo) {
    const regra = regras[campo.name];
    if (!regra) return true;
    const resultado = regra(campo.value);
    const ok = resultado === true;
    const erro = document.getElementById(`erro-${campo.name}`);

    campo.setAttribute("aria-invalid", String(!ok));
    if (erro) {
      erro.classList.toggle("visivel", !ok);
      erro.textContent = ok ? "" : resultado;
    }
    return ok;
  }

  Object.keys(regras).forEach((nome) => {
    const campo = form.elements[nome];
    campo?.addEventListener("blur", () => validarCampo(campo));
    campo?.addEventListener("input", () => {
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const campos = Object.keys(regras).map((n) => form.elements[n]);
    const valido = campos.map(validarCampo).every(Boolean);
    if (!valido) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const dados = new FormData(form);
    const servico = dados.get("servico");
    const msg =
      `Olá! Vim pelo site da Telles Barbershop e gostaria de agendar um horário.\n\n` +
      `*Nome:* ${dados.get("nome")}\n` +
      `*Telefone:* ${dados.get("whatsapp")}\n` +
      (servico ? `*Serviço:* ${servico}\n` : "") +
      `\n*Mensagem:*\n${dados.get("mensagem")}`;

    if (btnZap) btnZap.href = linkWhatsApp(msg);

    form.querySelector(".campos")?.setAttribute("hidden", "");
    form.querySelector(".formulario__rodape")?.setAttribute("hidden", "");
    sucesso?.classList.add("visivel");
    sucesso?.focus();
  });

  document.getElementById("enviar-novamente")?.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
    form.querySelectorAll(".campo__erro").forEach((e) => e.classList.remove("visivel"));
    form.querySelector(".campos")?.removeAttribute("hidden");
    form.querySelector(".formulario__rodape")?.removeAttribute("hidden");
    sucesso?.classList.remove("visivel");
    form.elements["nome"]?.focus();
  });
}

/* ---------- Ano do rodapé ---------- */
function iniciarRodape() {
  const el = document.getElementById("ano");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarHeader();
  iniciarLinksZap();
  iniciarRodape();
  iniciarGaleria();
  iniciarFormulario();
  iniciarRevelar();
});
