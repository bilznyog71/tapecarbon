/**
 * Integração Oficial Blackcat Payment Gateway
 * Documentação: https://docs.blackcatoficial.com/
 */

export interface BlackcatCustomer {
  name: string;
  email: string;
  phone: string;
  document: {
    number: string; // apenas dígitos (CPF/CNPJ)
    type: 'cpf' | 'cnpj';
  };
}

export interface BlackcatShipping {
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string; // 2 letras: SP, RJ, etc.
  zipCode: string; // apenas dígitos
}

export interface BlackcatItem {
  title: string;
  unitPrice: number; // centavos (ex: 24700 = R$ 247,00)
  quantity: number;
  tangible?: boolean;
}

export interface BlackcatCard {
  number: string;
  holderName: string;
  expiryMonth: string; // "01" - "12"
  expiryYear: string;  // "2026" - "2035"
  cvv: string;
  installments?: number;
}

export interface BlackcatDevice {
  http_browser_language?: string;
  http_browser_color_depth?: number;
  http_browser_screen_height?: number;
  http_browser_screen_width?: number;
  http_browser_time_difference?: number;
  http_browser_java_enabled?: boolean;
  http_browser_javascript_enabled?: boolean;
  user_agent?: string;
}

export interface BlackcatCreateSalePayload {
  amount: number; // centavos
  currency?: string; // 'BRL'
  paymentMethod: 'pix' | 'credit_card' | 'debit_card';
  items: BlackcatItem[];
  customer: BlackcatCustomer;
  shipping?: BlackcatShipping;
  card?: BlackcatCard;
  device?: BlackcatDevice;
  pix?: {
    expiresInDays?: number;
  };
  postbackUrl?: string;
  externalRef?: string;
  metadata?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface BlackcatSaleResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    transactionId: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING_3DS' | string;
    paymentMethod: string;
    amount: number;
    netAmount?: number;
    fees?: number;
    invoiceUrl?: string;
    createdAt?: string;
    paymentData?: {
      qrCode?: string;
      qrCodeBase64?: string;
      copyPaste?: string;
      expiresAt?: string;
      authorizationCode?: string;
      cardBrand?: string;
      lastDigits?: string;
    };
    threeDS?: {
      token: string;
      start: {
        id: string;
        status: string;
        acsUrl: string;
        acsPayload?: {
          creq?: string;
        };
      };
    };
    refusedReason?: {
      code: string;
      description: string;
    };
  };
}

export interface BlackcatStatusResponse {
  success: boolean;
  data?: {
    transactionId: string;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'FAILED' | string;
    paymentMethod: string;
    amount: number;
    netAmount?: number;
    fees?: number;
    paidAt?: string;
    endToEndId?: string;
  };
}

const BASE_URL = process.env.BLACKCAT_API_URL || 'https://api.blackcatoficial.com/api';

export async function createBlackcatSale(
  payload: BlackcatCreateSalePayload
): Promise<BlackcatSaleResponse> {
  const apiKey = process.env.BLACKCAT_API_KEY;

  if (!apiKey) {
    console.warn('[Blackcat] BLACKCAT_API_KEY não configurada no ambiente. Usando simulação inteligente para testes.');
    // Simulação quando a chave ainda não foi inserida no .env
    const fakeId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    if (payload.paymentMethod === 'pix') {
      const pixCode = `00020126580014br.gov.bcb.pix0136alfacarbon-shop-pix-${fakeId}520400005303986540${payload.amount / 100}5802BR5920ALFACARBON AUTOMOTIVO6009SAO PAULO62070503***6304ABCD`;
      return {
        success: true,
        data: {
          transactionId: fakeId,
          status: 'PENDING',
          paymentMethod: 'pix',
          amount: payload.amount,
          invoiceUrl: `https://alfacarbon.shop/checkout?txn=${fakeId}`,
          createdAt: new Date().toISOString(),
          paymentData: {
            qrCode: pixCode,
            copyPaste: pixCode,
            expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
          }
        }
      };
    } else {
      return {
        success: true,
        data: {
          transactionId: fakeId,
          status: 'PAID',
          paymentMethod: 'credit_card',
          amount: payload.amount,
          createdAt: new Date().toISOString(),
          paymentData: {
            authorizationCode: 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
            cardBrand: 'Visa',
            lastDigits: payload.card?.number?.slice(-4) || '1234'
          }
        }
      };
    }
  }

  const response = await fetch(`${BASE_URL}/sales/create-sale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();
  return data;
}

export async function checkBlackcatStatus(
  transactionId: string
): Promise<BlackcatStatusResponse> {
  const apiKey = process.env.BLACKCAT_API_KEY;

  if (!apiKey) {
    return {
      success: true,
      data: {
        transactionId,
        status: 'PENDING',
        paymentMethod: 'pix',
        amount: 24700,
      }
    };
  }

  const response = await fetch(`${BASE_URL}/sales/${transactionId}/status`, {
    method: 'GET',
    headers: {
      'X-API-Key': apiKey,
    },
    cache: 'no-store',
  });

  const data = await response.json();
  return data;
}
