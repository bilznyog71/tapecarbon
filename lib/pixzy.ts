/**
 * Integração Oficial PixzyPay Payment Gateway
 * Documentação: https://docs.pixzypay.com/
 */

export interface PixzyItem {
  name: string;
  price: number; // em centavos (ex: 24700 = R$ 247,00)
  quantity: number;
}

export interface PixzyCreateTransactionPayload {
  amount: number; // em centavos (mínimo: 500 = R$ 5,00)
  client_name: string;
  client_email: string;
  client_doc: string; // CPF ou CNPJ (apenas números ou formatado)
  client_phone?: string;
  webhook_url?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
  utms?: Record<string, string>;
  items?: PixzyItem[];
}

export interface PixzyCreateTransactionResponse {
  status: 'success' | 'error';
  data?: {
    transaction_id: string; // UUID da transação
    br_code: string; // Código PIX copia e cola
    amount: number;
    status: 'pending' | 'paid' | 'expired' | 'failed' | string;
    metadata?: Record<string, unknown> | null;
  };
  errors?: string;
  error?: string;
}

export interface PixzyTransaction {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed' | string;
  client_name?: string;
  client_email?: string;
  client_doc?: string;
  client_phone?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown> | null;
  items?: PixzyItem[];
  br_code?: string;
  qr_code?: string; // Imagem em base64 se disponível
}

export interface PixzyStatusResponse {
  status: 'success' | 'error';
  data?: PixzyTransaction;
  error?: string;
}

const BASE_URL = process.env.PIXZY_API_URL || 'https://app.pixzypay.com/api';

/**
 * Cria uma cobrança PIX dinâmica na PixzyPay
 */
export async function createPixzyTransaction(
  payload: PixzyCreateTransactionPayload
): Promise<PixzyCreateTransactionResponse> {
  const apiKey = process.env.PIXZY_API_KEY || process.env.PIXZYPAY_API_KEY;

  if (!apiKey) {
    console.warn('[PixzyPay] PIXZY_API_KEY não configurada no ambiente. Gerando simulação segura para desenvolvimento.');
    const fakeId = `019c${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136pixzypay-shop-pix-${fakeId}520400005303986540${(payload.amount / 100).toFixed(2)}5802BR5920ALFACARBON BRASIL6009SAO PAULO62070503***6304ABCD`;

    return {
      status: 'success',
      data: {
        transaction_id: fakeId,
        br_code: pixCode,
        amount: payload.amount,
        status: 'pending',
        metadata: payload.metadata,
      },
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[PixzyPay Error]', response.status, data);
      return {
        status: 'error',
        error: data.errors || data.error || `Erro ao gerar Pix no gateway (HTTP ${response.status})`,
      };
    }

    return data;
  } catch (err: unknown) {
    console.error('[PixzyPay Network Error]:', err);
    return {
      status: 'error',
      error: 'Falha de comunicação com a PixzyPay.',
    };
  }
}

/**
 * Consulta o status de uma transação na PixzyPay
 */
export async function checkPixzyStatus(
  transactionId: string
): Promise<PixzyStatusResponse> {
  const apiKey = process.env.PIXZY_API_KEY || process.env.PIXZYPAY_API_KEY;

  if (!apiKey) {
    return {
      status: 'success',
      data: {
        id: transactionId,
        amount: 24700,
        status: 'pending',
      },
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        error: data.error || `Erro ao consultar status (HTTP ${response.status})`,
      };
    }

    return data;
  } catch (err) {
    console.error('[PixzyPay Status Network Error]:', err);
    return {
      status: 'error',
      error: 'Falha de comunicação ao consultar status na PixzyPay.',
    };
  }
}
