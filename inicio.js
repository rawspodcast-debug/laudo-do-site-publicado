// Página inicial: pede o laudo (automático, ou pelo WhatsApp na fase beta) e desenha as capas
// e os pacotes. Sem bibliotecas; compatível com a CSP (nenhum script inline).
import { capa, cartoesPacotes } from "./ofertas.js";
import { conferirFormato } from "./regras-url.js";
import { WHATSAPP, laudoAutomatico, linkWhatsApp } from "./contato.js";

for (const el of document.querySelectorAll("[data-capa]")) el.replaceWith(capa(el.dataset.capa, { noTopo: !!el.closest(".capas") }));
document.getElementById("lista-pacotes")?.replaceWith(cartoesPacotes());

const form = document.getElementById("form-laudo");
const campo = document.getElementById("url");
const botao = document.getElementById("btn-verificar");
const caixaErro = document.getElementById("erro-url");
const textoErro = document.getElementById("erro-texto");
const pedidoOk = document.getElementById("pedido-ok");

// No computador local o laudo é automático: o botão diz o que vai acontecer.
if (laudoAutomatico()) document.getElementById("btn-rotulo").textContent = "Gerar laudo agora";

function mostrarErro(msg) {
  textoErro.textContent = msg;
  caixaErro.hidden = false;
  campo.setAttribute("aria-invalid", "true");
  campo.focus();
}
function limparErro() {
  caixaErro.hidden = true;
  pedidoOk.hidden = true;
  campo.removeAttribute("aria-invalid");
}
function ocupado(sim) {
  botao.disabled = sim;
  botao.setAttribute("aria-busy", String(sim));
}

campo.addEventListener("input", limparErro);

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (botao.disabled) return;
  const url = campo.value.trim();
  if (!url) return mostrarErro("Informe o endereço do site. Exemplo: seusite.com.br");
  limparErro();

  // Fase beta: confere o endereço aqui e abre o WhatsApp com o pedido pronto.
  if (!laudoAutomatico()) {
    const formato = conferirFormato(url);
    if (formato.erro) return mostrarErro(formato.erro);
    if (!WHATSAPP) return mostrarErro("O pedido pelo WhatsApp ainda não está disponível. Tente mais tarde.");
    // Página específica (ex.: /produtos) vai inteira: a parte de Google e IAs analisa a página informada.
    const { pathname, search } = new URL(formato.url);
    const alvo = pathname === "/" && !search ? formato.host : formato.url.replace(/^https?:\/\//, "");
    window.open(linkWhatsApp(`Olá! Quero a nota grátis do site ${alvo}`), "_blank", "noopener");
    pedidoOk.hidden = false;
    return;
  }

  ocupado(true);
  try {
    const r = await fetch("/api/diagnosticos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const dados = await r.json().catch(() => ({}));
    if (r.status === 202 && dados.id) {
      location.assign(`/r/${encodeURIComponent(dados.id)}`);
      return;
    }
    mostrarErro(dados.erro || "Não foi possível iniciar o diagnóstico. Tente de novo em alguns minutos.");
  } catch {
    mostrarErro("Sem conexão com o servidor. Confira sua internet e tente de novo.");
  }
  ocupado(false);
});
