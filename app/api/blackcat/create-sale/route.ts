import { NextRequest, NextResponse } from 'next/server';
import { createBlackcatSale, BlackcatCreateSalePayload, BlackcatItem } from '@/lib/blackcat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      cart,
      customer,
      address,
      paymentMethod,
      cardData,
      device,
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
      : (paymentMethod === 'pix' ? Math.round(subtotal * 0.95) : subtotal);

    // Garante valor positivo
    if (finalAmount <= 0) finalAmount = subtotal;

    const amountInCents = Math.round(finalAmount * 100);

    // Mapeia o item garantindo que unitPrice coincida exatamente com amountInCents
    const itemTitle = Array.isArray(cart) && cart.length > 0
      ? `${cart[0].kitName || 'Tapete Bandeja 3D'} - ${cart[0].vehicle || 'AlfaCarbon'}${cart.length > 1 ? ` (+${cart.length - 1} item)` : ''}`
      : 'Kit Tapetes Bandeja 3D AlfaCarbon';

    const items: BlackcatItem[] = [
      {
        title: itemTitle,
        unitPrice: amountInCents,
        quantity: 1,
        tangible: true,
      },
    ];

    const host = req.headers.get('host') || 'alfacarbon.shop';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const externalRef = `AC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload: BlackcatCreateSalePayload = {
      amount: amountInCents,
      currency: 'BRL',
      paymentMethod: paymentMethod === 'card' ? 'credit_card' : 'pix',
      items,
      customer: {
        name: `${customer.nome} ${customer.sobrenome || ''}`.trim(),
        email: customer.email.trim(),
        phone: customer.telefone.replace(/\D/g, ''),
        document: {
          number: customer.cpf.replace(/\D/g, ''),
          type: 'cpf',
        },
      },
      shipping: {
        name: `${customer.nome} ${customer.sobrenome || ''}`.trim(),
        street: address.rua.trim(),
        number: address.numero.trim(),
        complement: address.complemento?.trim() || undefined,
        neighborhood: address.bairro?.trim() || 'Centro',
        city: address.cidade.trim(),
        state: (address.estado || 'SP').trim().slice(0, 2).toUpperCase(),
        zipCode: address.cep.replace(/\D/g, ''),
      },
      externalRef,
      postbackUrl: `${baseUrl}/api/webhooks/blackcat`,
      metadata: JSON.stringify({
        store: 'AlfaCarbon Brasil',
        externalRef,
      }),
    };

    if (utm?.source) payload.utm_source = utm.source;
    if (utm?.medium) payload.utm_medium = utm.medium;
    if (utm?.campaign) payload.utm_campaign = utm.campaign;

    // Configuração PIX
    if (paymentMethod === 'pix') {
      payload.pix = {
        expiresInDays: 1,
      };
    }

    // Configuração Cartão de Crédito
    if (paymentMethod === 'card' && cardData) {
      const rawExp = (cardData.expiry || '').replace(/\D/g, '');
      const month = rawExp.slice(0, 2) || '12';
      let year = rawExp.slice(2) || '28';
      if (year.length === 2) year = `20${year}`;

      payload.card = {
        number: (cardData.number || '').replace(/\D/g, ''),
        holderName: (cardData.holderName || customer.nome).toUpperCase(),
        expiryMonth: month.padStart(2, '0'),
        expiryYear: year,
        cvv: (cardData.cvv || '').replace(/\D/g, ''),
        installments: Number(cardData.installments) || 1,
      };

      if (device) {
        payload.device = device;
      }
    }

    const result = await createBlackcatSale(payload);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[Blackcat API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar transação na Blackcat.' },
      { status: 500 }
    );
  }
}
