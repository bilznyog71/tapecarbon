import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderMetrics,
  OrderStatus,
} from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alfa2026!';
const COOKIE_NAME = 'alfa_admin_session';

function verifyAuth(req: NextRequest): boolean {
  const session = req.cookies.get(COOKIE_NAME)?.value;
  const expected = crypto.createHash('sha256').update(`admin_secret_salt_${ADMIN_PASSWORD}`).digest('hex');

  if (session && session === expected) return true;

  // Permite também autenticação via header Authorization: Bearer <ADMIN_PASSWORD>
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.replace(/^Bearer\s+/i, '').trim() === ADMIN_PASSWORD.trim()) {
    return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'todos';
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    const allOrders = await getAllOrders();
    const metrics = await getOrderMetrics();

    const now = Date.now();
    const ABANDON_TIMEOUT_MS = 25 * 60 * 1000;

    // Filtra por aba
    let filtered = allOrders.filter(order => {
      const orderAge = now - new Date(order.createdAt).getTime();

      if (filter === 'pagos') {
        return order.status === 'PAGO';
      }
      if (filter === 'pendentes') {
        return order.status === 'PENDENTE';
      }
      if (filter === 'iniciadas') {
        return order.status === 'INICIADA' && orderAge <= ABANDON_TIMEOUT_MS;
      }
      if (filter === 'abandonadas') {
        return order.status === 'ABANDONADA' || (order.status === 'INICIADA' && orderAge > ABANDON_TIMEOUT_MS);
      }
      return true; // 'todos'
    });

    // Filtra por busca de texto (nome, email, telefone, cpf, transação, carro)
    if (search) {
      filtered = filtered.filter(order => {
        const full = [
          order.customer.nome,
          order.customer.sobrenome,
          order.customer.email,
          order.customer.telefone,
          order.customer.cpf,
          order.id,
          order.transactionId,
          order.externalRef,
          order.cart?.map(c => `${c.vehicle} ${c.kitName}`).join(' '),
        ].filter(Boolean).join(' ').toLowerCase();

        return full.includes(search);
      });
    }

    return NextResponse.json({
      success: true,
      orders: filtered,
      metrics,
    });
  } catch (error) {
    console.error('[Admin Get Orders Error]:', error);
    return NextResponse.json({ success: false, error: 'Erro ao carregar pedidos' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status as OrderStatus, { notes });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Pedido não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('[Admin Update Order Error]:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar pedido' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID obrigatório' }, { status: 400 });
    }

    const ok = await deleteOrder(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('[Admin Delete Order Error]:', error);
    return NextResponse.json({ success: false, error: 'Erro ao excluir pedido' }, { status: 500 });
  }
}
