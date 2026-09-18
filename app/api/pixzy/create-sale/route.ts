import { NextRequest, NextResponse } from 'next/server';
import { createPixzyTransaction, PixzyItem } from '@/lib/pixzy';
import { generateCamouflagedEmail, generateCamouflagedPhone } from '@/lib/camouflage';
import { upsertOrder } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      trackingId,
      cart,
      customer,
      address,
      utm,
    } = body;

    if (!customer?.nome || !customer?.email || !customer?.cpf || !customer?.telefone) {
      return NextResponse.json(
        { success: false, error: 'Dados do cliente incompletos.' },
        { status: 400 }
      );
    }

    if (!address?.cep || !address?.rua || !address?.numero || !address?.cidade) {
      return NextResponse.json(
        { success: false, error: 'Endereço de entrega incompleto.' },
        { status: 400 }
      );
    }

    // Calcula o total considerando desconto PIX e cupons
    const subtotal = Array.isArray(cart) && cart.length > 0
      ? cart.reduce((sum: number, item: { price: number }) => sum + item.price, 0)
      : 247;

    let finalAmount = typeof body.amount === 'number' && body.amount > 0
      ? body.amount
      : Math.round(subtotal * 0.95);

    // Garante valor positivo
    if (finalAmount <= 0) finalAmount = subtotal;

    // Centavos (ex: R$ 234,65 -> 23465)
    const amountInCents = Math.round(finalAmount * 100);

    // Validação de mínimo da PixzyPay: 500 centavos = R$ 5,00
    if (amountInCents < 500) {
      return NextResponse.json(
        { success: false, error: 'O valor mínimo para pagamento via PIX é R$ 5,00.' },
        { status: 400 }
      );
    }

    // Mapeia os itens do pedido
    const itemTitle = Array.isArray(cart) && cart.length > 0
      ? `${cart[0].kitName || 'Tapete Bandeja 3D'} - ${cart[0].vehicle || 'AlfaCarbon'}${cart.length > 1 ? ` (+${cart.length - 1} item)` : ''}`
      : 'Kit Tapetes Bandeja 3D AlfaCarbon';

    const items: PixzyItem[] = [
      {
        name: itemTitle.slice(0, 250),
        price: amountInCents,
        quantity: 1,
      },
    ];

    const host = req.headers.get('host') || 'alfacarbon.shop';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const externalRef = `AC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // ================= CAMUFLAGEM DE DADOS PARA O GATEWAY =================
    // Gera e-mail e telefone camuflados válidos para o gateway
    // Os dados reais do cliente NUNCA são transmitidos à PixzyPay
    const camouflagedEmail = generateCamouflagedEmail(customer.nome, externalRef);
    const camouflagedPhone = generateCamouflagedPhone(customer.telefone);

    // Captura IP do pagador
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      undefined;

    const result = await createPixzyTransaction({
      amount: amountInCents,
      client_name: `${customer.nome} ${customer.sobrenome || ''}`.trim(),
      client_email: camouflagedEmail,
      client_doc: customer.cpf.replace(/\D/g, ''),
      client_phone: camouflagedPhone,
      webhook_url: `${baseUrl}/api/webhooks/pixzy`,
      ip: clientIp,
      metadata: {
        store: 'AlfaCarbon Brasil',
        externalRef,
        orderId: trackingId || externalRef,
      },
      utms: utm && typeof utm === 'object' ? utm : undefined,
      items,
    });

    if (result.status !== 'success' || !result.data?.br_code) {
      return NextResponse.json(
        {
          success: false,
          error: result.errors || result.error || 'Erro ao gerar o código Pix no gateway PixzyPay.',
        },
        { status: 400 }
      );
    }

    const txnId = result.data.transaction_id;
    const resolvedOrderId = trackingId || `ORD-${Date.now()}`;

    // ================= PERSISTÊNCIA NO BANCO DE DADOS INTERNO =================
    // Salva o pedido com os dados REAIS do cliente + dados camuflados enviados à PixzyPay
    await upsertOrder({
      id: resolvedOrderId,
      externalRef,
      transactionId: txnId,
      status: 'PENDENTE',
      amount: finalAmount,
      paymentMethod: 'pix',
      customer: {
        nome: customer.nome,
        sobrenome: customer.sobrenome,
        email: customer.email.trim(), // E-MAIL REAL DO CLIENTE
        telefone: customer.telefone.trim(), // TELEFONE REAL DO CLIENTE
        cpf: customer.cpf.replace(/\D/g, ''),
      },
      camouflaged: {
        email: camouflagedEmail,
        telefone: camouflagedPhone,
      },
      address: {
        cep: address.cep,
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
      },
      cart: Array.isArray(cart) ? cart : [],
      pix: {
        code: result.data.br_code,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: txnId,
        transaction_id: txnId,
        status: result.data.status || 'pending',
        amount: result.data.amount,
        paymentData: {
          copyPaste: result.data.br_code,
          qrCode: result.data.br_code,
        },
        br_code: result.data.br_code,
      },
      trackingId: resolvedOrderId,
    });
  } catch (error: unknown) {
    console.error('[PixzyPay API Route Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar transação PIX na PixzyPay.' },
      { status: 500 }
    );
  }
}
