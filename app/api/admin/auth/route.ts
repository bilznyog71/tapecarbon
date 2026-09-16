import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alfa2026!';
const COOKIE_NAME = 'alfa_admin_session';

// Gera um token de sessão estável baseado na senha atual
function getExpectedToken(): string {
  return crypto.createHash('sha256').update(`admin_secret_salt_${ADMIN_PASSWORD}`).digest('hex');
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get(COOKIE_NAME)?.value;
  const expected = getExpectedToken();

  if (session && session === expected) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Senha não fornecida' }, { status: 400 });
    }

    if (password.trim() === ADMIN_PASSWORD.trim()) {
      const token = getExpectedToken();
      const response = NextResponse.json({ success: true, message: 'Autenticado com sucesso' });

      // Seta cookie seguro com duração de 30 dias
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 dias
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
  } catch (error) {
    console.error('[Admin Auth Error]:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao autenticar' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sessão encerrada' });
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
