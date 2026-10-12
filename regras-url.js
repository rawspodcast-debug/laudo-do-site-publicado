// Regras do endereço digitado, usadas no navegador (antes de abrir o WhatsApp) e no servidor
// (src/validar-url.mjs, antes de resolver o DNS). Um só lugar: o que a página aceita é o que o
// laudo aceita.

export const SUFIXOS_INTERNOS = /\.(local|localhost|internal|intranet|lan|home|corp|test|example|invalid|home\.arpa)$/i;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

// Devolve { erro } ou { url, host } (url normalizada, sem #fragmento; host sem ponto final).
export function conferirFormato(entrada) {
  const bruta = String(entrada ?? "").trim();
  if (!bruta) return { erro: "Informe o endereço do site." };
  if (bruta.length > 2048) return { erro: "Endereço longo demais." };

  let url;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(bruta) ? bruta : `https://${bruta}`);
  } catch {
    return { erro: "Endereço inválido. Exemplo: seusite.com.br" };
  }
  if (!["http:", "https:"].includes(url.protocol)) return { erro: "Use um endereço http:// ou https://." };
  if (url.username || url.password) return { erro: "Endereço com usuário e senha não é aceito." };
  if (url.port) return { erro: "Use o endereço do site sem número de porta." };

  const host = url.hostname.replace(/\.$/, "").toLowerCase();
  if (IPV4.test(host) || host.startsWith("[")) return { erro: "Informe o domínio do site (ex.: seusite.com.br), não um IP." };
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z][a-z0-9-]{1,62}$/.test(host)) return { erro: "Domínio inválido. Exemplo: seusite.com.br" };
  if (SUFIXOS_INTERNOS.test(host)) return { erro: "Esse domínio não é um site público." };

  url.hostname = host;
  url.hash = "";
  return { url: url.href, host };
}
