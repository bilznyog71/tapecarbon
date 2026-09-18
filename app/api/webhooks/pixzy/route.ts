import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[PixzyPay Webhook Received]:', JSON.stringify(body, null, 2));

    const event = body.event || body.type;
    const transaction = body.transaction || body.data?.transaction || body.data || {};

    const transactionId = transaction.id || transaction.transaction_id;
    const metadata = transaction.metadata || {};
    const externalRef = metadata.externalRef || metadata.orderId;
    const status = (transaction.status || '').toLowerCase();

    console.log(`[PixzyPay Webhook] Evento: ${event}, ID: ${transactionId}, Status: ${status}`);

    const idToUpdate = transactionId ? String(transactionId) : (externalRef ? String(externalRef) : null);

    if (idToUpdate) {
      if (event === 'paid' || event === 'transaction_paid' || status === 'paid') {
        await updateOrderStatus(idToUpdate, 'PAGO');
        console.log(`[PixzyPay Webhook] Pedido ${idToUpdate} marcado como PAGO com sucesso.`);
      } else if (
        event === 'expired' ||
        event === 'failed' ||
        event === 'transaction_cancelled' ||
        status === 'expired' ||
        status === 'failed' ||
        status === 'cancelled'
      ) {
        await updateOrderStatus(idToUpdate, 'CANCELADO');
        console.log(`[PixzyPay Webhook] Pedido ${idToUpdate} marcado como CANCELADO.`);
      }
    }

    // Responde 200 OK para confirmar o recebimento conforme a documentação
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[PixzyPay Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao processar webhook PixzyPay' },
      { status: 400 }
    );
  }
}
