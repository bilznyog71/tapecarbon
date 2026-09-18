import { NextRequest, NextResponse } from 'next/server';
import { checkPixzyStatus } from '@/lib/pixzy';
import { updateOrderStatus } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de transação obrigatório.' },
        { status: 400 }
      );
    }

    const res = await checkPixzyStatus(id);

    if (res.status !== 'success' || !res.data) {
      return NextResponse.json(
        { success: false, error: res.error || 'Transação não encontrada.' },
        { status: 404 }
      );
    }

    const txStatus = res.data.status?.toLowerCase();
    const isPaid = txStatus === 'paid';

    // Se aprovado, sincroniza no banco de dados interno
    if (isPaid) {
      await updateOrderStatus(id, 'PAGO');
    } else if (txStatus === 'expired' || txStatus === 'failed') {
      await updateOrderStatus(id, 'CANCELADO');
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: res.data.id,
        status: isPaid ? 'PAID' : (txStatus?.toUpperCase() || 'PENDING'),
        amount: res.data.amount,
        pixzyStatus: res.data.status,
        br_code: res.data.br_code,
        qr_code: res.data.qr_code,
      },
    });
  } catch (error) {
    console.error('[PixzyPay Status Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao consultar status na PixzyPay.' },
      { status: 500 }
    );
  }
}
