// Contato e modo do laudo. Um só lugar para o número do WhatsApp e o endereço do site.

// WhatsApp que recebe os pedidos: só dígitos, com 55 e DDD (ex.: "5511912345678").
export const WHATSAPP = "5547997198877";

// Endereço oficial do site (gravado por scripts/dominio.mjs). Usado nos links do laudo em PDF.
export const SITE = "https://laudodosite.com.br";

// Laudo automático no próprio site (precisa do servidor com a API, numa VPS). Enquanto for
// false, o site pede o laudo pelo WhatsApp e ele é gerado no computador do Rafael
// (npm run laudo -- site.com.br). No computador local (127.0.0.1) o automático vale sempre.
export const LAUDO_AUTOMATICO = false;

export const PRAZO = "até 1 dia útil";

export const laudoAutomatico = () =>
  LAUDO_AUTOMATICO || ["127.0.0.1", "localhost"].includes(globalThis.location?.hostname);

export const linkWhatsApp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
