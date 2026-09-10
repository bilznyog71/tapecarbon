'use client';

import React from 'react';

export default function CompanySection() {
  return (
    <section className="sec sec-soft" id="empresa">
      <div className="wrap">
        <div className="feat">
          <div className="feat-txt">
            <span className="kicker">A empresa</span>
            <h2>Atendemos a todo o Brasil</h2>
            <p>
              A TapeCarbon desenvolve e comercializa tapetes automotivos bandeja 3D de alta precisão.
              Trabalhamos com molde exclusivo para cada modelo e ano, controle de qualidade peça por peça
              e atendimento humanizado por WhatsApp antes, durante e após a sua compra.
            </p>
            <p style={{ marginTop: '12px' }}>
              Somos uma empresa séria e formalizada: emitimos Nota Fiscal Eletrônica (NF-e) em todas as vendas
              e atuamos em estrita conformidade com a Lei nº 8.078/1990 (Código de Defesa do Consumidor)
              e com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Envios rápidos e seguros via Correios e transportadoras para todo o território nacional.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Suporte técnico e comercial de segunda a sexta-feira, das 9h às 18h.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Nota Fiscal e certificado de garantia de 12 meses acompanham seu pedido.</span>
              </li>
            </ul>
          </div>

          <div className="feat-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/empresa.png"
              width="1000"
              height="670"
              loading="lazy"
              alt="Instalações e centro de distribuição da TapeCarbon"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
