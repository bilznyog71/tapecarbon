import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Blackcat Webhook Received]:', JSON.stringify(body, null, 2));

    // O status do pagamento vem no webhook (ex: PAID, CANCELLED, REFUNDED)
    const { transactionId, status, paymentMethod, amount, externalRef } = body.data || body;

    console.log(`[Blackcat Webhook] Pedido ${transactionId || externalRef} atualizado para ${status} (${paymentMethod}, R$ ${amount ? amount / 100 : ''})`);

    const idToUpdate = transactionId || externalRef;
    if (idToUpdate) {
      if (status === 'PAID') {
        await updateOrderStatus(idToUpdate, 'PAGO');
      } else if (status === 'CANCELLED' || status === 'REFUNDED') {
        await updateOrderStatus(idToUpdate, 'CANCELADO');
      }
    }

    // Retorna 200 OK para confirmar o recebimento
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[Blackcat Webhook Error]:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 400 });
  }
}

