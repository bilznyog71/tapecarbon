/**
 * Utilitário de Camuflagem de Dados para Gateways de Pagamento (PixzyPay / Blackcat)
 * Permite enviar dados válidos para a API sem vazar o e-mail ou telefone real do cliente.
 */

// Gera um e-mail camuflado válido para o gateway
export function generateCamouflagedEmail(customerName: string, orderRef?: string): string {
  const cleanName = customerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8) || 'cliente';

  const randomHash = Math.random().toString(36).substring(2, 7);
  const timestamp = Date.now().toString(36).slice(-4);
  const ref = orderRef ? orderRef.slice(-6).toLowerCase() : `${cleanName}${randomHash}`;

  // Formato limpo e profissional aceito por qualquer gateway
  return `ped.${ref}.${timestamp}@orderpay-sec.com`;
}

// Gera um número de telefone com DDD válido no Brasil para a validação do gateway
export function generateCamouflagedPhone(originalPhone?: string): string {
  // Mantém o DDD do cliente caso exista para coerência de região, ou usa 11 como fallback
  let ddd = '11';
  if (originalPhone) {
    const raw = originalPhone.replace(/\D/g, '');
    if (raw.length >= 2) {
      const parsedDdd = raw.slice(0, 2);
      const validDdds = [
        '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '21', '22', '24', '27', '28', '31', '32', '33', '34',
        '35', '37', '38', '41', '42', '43', '44', '45', '46',
        '47', '48', '49', '51', '53', '54', '55', '61', '62',
        '63', '64', '65', '66', '67', '68', '69', '71', '73',
        '74', '75', '77', '79', '81', '82', '83', '84', '85',
        '86', '87', '88', '89', '91', '92', '93', '94', '95',
        '96', '97', '98', '99',
      ];
      if (validDdds.includes(parsedDdd)) {
        ddd = parsedDdd;
      }
    }
  }

  // Gera 8 dígitos aleatórios com prefixo móvel '9' (ex: 11 9xxxx-xxxx)
  const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
  return `${ddd}9${randomSuffix}`;
}
