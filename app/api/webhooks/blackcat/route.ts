import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Blackcat Webhook Received]:', JSON.stringify(body, null, 2));

    // O status do pagamento vem no webhook (ex: PAID, CANCELLED, REFUNDED)
    const { transactionId, status, paymentMethod, amount } = body.data || body;

    console.log(`[Blackcat Webhook] Pedido ${transactionId} atualizado para ${status} (${paymentMethod}, R$ ${amount / 100})`);

    // Retorna 200 OK para confirmar o recebimento
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[Blackcat Webhook Error]:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 400 });
  }
}
