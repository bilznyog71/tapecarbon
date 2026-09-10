import { NextRequest, NextResponse } from 'next/server';
import { checkBlackcatStatus } from '@/lib/blackcat';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID obrigatório.' },
        { status: 400 }
      );
    }

    const status = await checkBlackcatStatus(id);
    return NextResponse.json(status);
  } catch (error) {
    console.error('[Blackcat Status Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao consultar status na Blackcat.' },
      { status: 500 }
    );
  }
}
