'use client';

import React from 'react';

const TRUST_ITEMS = [
  {
    icon: '/images/enviorastreavel.png',
    title: 'Envio rápido',
    subtitle: 'Código de rastreio enviado',
    alt: 'Ícone de envio rastreável'
  },
  {
    icon: '/images/atrendimento.png',
    title: 'Suporte ao cliente',
    subtitle: 'Atendimento humanizado',
    alt: 'Ícone de atendimento humanizado'
  },
  {
    icon: '/images/iconpixcheckout.png',
    title: 'Pagamento à vista',
    subtitle: '5% de desconto no Pix',
    alt: 'Ícone de desconto Pix'
  },
  {
    icon: '/images/protecao.png',
    title: 'Compra 100% segura',
    subtitle: 'Site protegido com SSL',
    alt: 'Ícone de segurança SSL'
  }
];

export default function TrustStrip() {
  return (
    <section className="py-6 sm:py-8 bg-[#090b0e] border-t border-b border-white/5 overflow-hidden" id="confianca">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll on mobile ("uma ao lado da outra"), centered on desktop */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-2 px-1 sm:justify-center flex-nowrap scroll-smooth snap-x snap-mandatory">
          {TRUST_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-[#11141b] border border-white/10 rounded-2xl px-4 py-3 flex-shrink-0 shadow-lg snap-start transition-all hover:border-white/20 hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt={item.alt}
                className="w-6 h-6 object-contain flex-shrink-0 invert opacity-90"
                loading="lazy"
              />
              <div className="flex flex-col text-left">
                <span className="text-[13px] sm:text-[14px] font-bold text-white leading-tight tracking-tight">
                  {item.title}
                </span>
                <span className="text-[11px] sm:text-[12px] text-gray-400 font-normal leading-tight mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
