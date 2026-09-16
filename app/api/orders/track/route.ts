import { NextRequest, NextResponse } from 'next/server';
import { upsertOrder, OrderRecord } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      customer,
      address,
      cart,
      amount,
      status = 'INICIADA',
      paymentMethod,
    } = body;

    if (!customer?.nome && !customer?.email && !customer?.telefone) {
      return NextResponse.json({ success: false, error: 'Dados insuficientes' }, { status: 400 });
    }

    const orderId = id || `LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const record: Partial<OrderRecord> & { id: string } = {
      id: orderId,
      status: status,
      customer: {
        nome: customer.nome || '',
        sobrenome: customer.sobrenome || '',
        email: customer.email || '',
        telefone: customer.telefone || '',
        cpf: customer.cpf || '',
      },
      address: address?.cep ? address : undefined,
      cart: Array.isArray(cart) ? cart : [],
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || 'pix',
    };

    const saved = await upsertOrder(record);

    return NextResponse.json({
      success: true,
      trackingId: saved.id,
      order: saved,
    });
  } catch (error) {
    console.error('[Track Order Error]:', error);
    return NextResponse.json({ success: false, error: 'Erro ao registrar lead' }, { status: 500 });
  }
}
