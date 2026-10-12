// Ofertas do Laudo do Site: os dois manuais e os três pacotes. Um só lugar para links e preços.
// Enquanto um link estiver vazio, o botão aparece apagado como "em breve" (nunca um link morto);
// preço vazio mostra o marcador de preenchimento, que `npm run conferir` barra antes de publicar.

// Links de compra (https://) da Kiwify. Preços aprovados em 10/10/2026. Os dois manuais avulsos custam
// o mesmo: o cartão "Um manual" mostra o preço de `seguro`.
export const PACOTES = {
  seguro: { link: "https://pay.kiwify.com.br/nr8va74", preco: "R$ 47" }, // P: Seu Site Seguro
  google: { link: "https://pay.kiwify.com.br/UccoDQs", preco: "R$ 47" }, // P: Seu Site no Google e nas IAs
  combo:  { link: "https://pay.kiwify.com.br/zolckXP", preco: "R$ 67" }, // M: os dois manuais
  kit:    { link: "https://pay.kiwify.com.br/rvvy38M", preco: "R$ 197" }, // G: os dois manuais + as skills, licença individual
  kitEmpresa: { link: "https://pay.kiwify.com.br/AOe5mLb", preco: "R$ 297" }, // G: o mesmo kit, licença para a empresa
};

export const MANUAIS = {
  seguro: {
    nome: "Seu Site Seguro",
    destaque: "Seguro",
    promessa: "Proteja o site, o e-mail do domínio e os dados dos seus clientes.",
    sumario: [
      { parte: "Parte 1 · Corrija o que o laudo encontrou", capitulos: [
        "HTTPS e certificado",
        "Cabeçalhos de proteção",
        "Cookies de login",
        "E-mail do domínio",
        "O que o site revela sobre si",
      ] },
      { parte: "Parte 2 · Para quem cria sites e apps com IA", capitulos: [
        "A nova realidade: criar ficou fácil, proteger continua essencial",
        "Conheça seu sistema antes de tentar protegê-lo",
        "Um método de revisão que evita alarmes falsos",
        "Os controles essenciais de uma aplicação web",
        "Segredos, dependências e cadeia de suprimentos",
        "Bancos gerenciados, APIs e pagamentos",
        "Segurança em aplicações com IA, RAG e agentes",
        "LGPD: privacidade desde o desenho",
        "Teste, registre e valide as correções",
        "Checklist prático antes de publicar",
        "Um plano de 30 dias para melhorar a segurança",
      ] },
    ],
  },
  google: {
    nome: "Seu Site no Google e nas IAs",
    destaque: "Google e nas IAs",
    promessa: "Aumente suas chances de ser encontrado no Google e citado pelo ChatGPT, Gemini e outras IAs.",
    sumario: [
      { parte: "Parte 1 · Corrija o que o laudo encontrou", capitulos: [
        "O Google e as IAs conseguem ler o seu site?",
        "A página que vira resposta",
        "A ficha da sua empresa (dados estruturados)",
      ] },
      { parte: "Parte 2 · Para ser encontrado e citado", capitulos: [
        "Seu perfil de empresa no Google",
        "Search Console e Bing: avise que o site existe",
        "Robôs de IA e llms.txt: o que liberar e o que bloquear",
        "Ser citado: menções e autoridade fora do seu site",
        "Medir: as IAs já citam você?",
      ] },
    ],
  },
};

const NS = "http://www.w3.org/2000/svg";
function svg(caminhos) {
  const s = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" })) s.setAttribute(k, v);
  s.innerHTML = caminhos; // constante deste arquivo, nunca dado externo
  return s;
}
const ICONE_LIVRO = '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>';

function el(tag, attrs = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined && v !== false) k === "class" ? (e.className = v) : e.setAttribute(k, String(v));
  for (const f of filhos.flat()) if (f !== null && f !== undefined && f !== false) e.append(f instanceof Node ? f : document.createTextNode(String(f)));
  return e;
}
const marcador = (texto) => el("span", { class: "preencher" }, `[PREENCHER: ${texto}]`);

function botao(chave, rotulo, classe = "btn-pri") {
  const { link } = PACOTES[chave];
  // Sem link ainda: botão apagado "Em breve" (o site pode ir ao ar antes das vendas abrirem).
  if (!/^https:\/\//.test(link)) return el("span", { class: `${classe} em-breve`, "aria-disabled": "true" }, `${rotulo} · em breve`);
  const a = el("a", { class: classe, href: link, rel: "noopener" }, svg(ICONE_LIVRO), rotulo);
  return a;
}
const preco = (chave) => PACOTES[chave].preco ? el("span", {}, PACOTES[chave].preco) : marcador("preço");

// Capa original do manual (gerada com o livro: manuais/saida/<livro>/capa.png, reduzida para a
// web em public/capas/). `noTopo`: carrega já, sem esperar a rolagem (está na primeira tela).
export function capa(chave, { noTopo = false } = {}) {
  return el("img", {
    class: `capa-livro${chave === "google" ? " apoio" : ""}`,
    src: `/capas/${chave}.webp`, width: 600, height: 960,
    alt: `Capa do manual “${MANUAIS[chave].nome}”`,
    loading: noTopo ? "eager" : "lazy", decoding: "async",
  });
}

// Bônus de toda compra: o laudo completo do site do comprador.
const bonusLaudo = () => el("li", { class: "bonus" }, el("strong", {}, "Bônus:"), " o laudo completo do seu site, com o capítulo de cada correção");

// Os três pacotes. `recomendado`: "um" | "combo" | "kit"; `motivo`: frase curta do porquê
// (no laudo); `manualSugerido`: no pacote "um", qual manual vem primeiro.
export function cartoesPacotes({ recomendado = "combo", motivo = null, manualSugerido = null, notaKit = null } = {}) {
  const selo = (k) => k === recomendado ? el("span", { class: "selo-recomendado" }, motivo ? "Recomendado para este site" : "Recomendado") : null;
  const ordem = manualSugerido === "google" ? ["google", "seguro"] : ["seguro", "google"];
  const cartao = (k, classe, ...filhos) => el("li", { class: `cartao pacote${k === recomendado ? " recomendado" : ""}${classe ? " " + classe : ""}` }, selo(k), ...filhos);
  return el("ul", { class: "pacotes" },
    cartao("um", "",
      el("h3", {}, "Um manual"),
      el("p", { class: "pacote-desc" }, "Escolha o tema que mais pesa para você agora."),
      el("p", { class: "preco" }, preco("seguro"), el("small", {}, " cada")),
      el("ul", { class: "lista-check" }, el("li", {}, "Passo a passo para corrigir o que o laudo encontrou no tema"), el("li", {}, "Como conferir se a correção funcionou"), bonusLaudo()),
      el("div", { class: "pacote-botoes" }, ordem.map((k) => botao(k, MANUAIS[k].nome, "btn-sec"))),
    ),
    cartao("combo", "",
      el("h3", {}, "Os dois manuais"),
      el("p", { class: "pacote-desc" }, "Segurança e Google e IAs: tudo o que o laudo aponta."),
      el("p", { class: "preco" }, preco("combo")),
      el("ul", { class: "lista-check" },
        el("li", {}, `${MANUAIS.seguro.nome}`), el("li", {}, `${MANUAIS.google.nome}`),
        el("li", {}, "Cada problema do laudo com o capítulo que o corrige"), bonusLaudo()),
      botao("combo", "Quero os dois manuais"),
    ),
    cartao("kit", "",
      el("h3", {}, "Kit com IA"),
      el("p", { class: "pacote-desc" }, "Os dois manuais e as skills: a sua IA aplica as correções no projeto."),
      el("p", { class: "preco" }, preco("kit"), el("small", {}, " por pessoa")),
      el("p", { class: "preco-alt" }, preco("kitEmpresa"), " para a empresa toda (sócios e funcionários)"),
      el("ul", { class: "lista-check" },
        el("li", {}, "Os dois manuais"), el("li", {}, "Skills de segurança e de Google e IAs"),
        el("li", {}, "Guia “Comece aqui” para instalar e usar"), bonusLaudo()),
      el("p", { class: "pacote-nota" }, notaKit ?? "Para sites feitos em código, com uma IA (Claude Code ou Cursor) com acesso ao projeto. Em WordPress ou construtores de site, os manuais são o caminho."),
      el("div", { class: "pacote-botoes" },
        botao("kit", "Kit com IA · individual", "btn-sec"),
        botao("kitEmpresa", "Kit com IA · empresa", "btn-sec")),
    ),
  );
}
