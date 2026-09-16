'use client';

import React, { useState, useEffect } from 'react';
import { CONFIG, formatMoney } from '@/data/config';

export default function LaunchOffer() {
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const cheapestKit = CONFIG.kits.reduce((a, b) => (a.price <= b.price ? a : b));
  const discountPercent = Math.round((1 - cheapestKit.price / cheapestKit.priceOld) * 100);

  useEffect(() => {
    const STORAGE_KEY = 'tapecarbon_br_deadline';
    let end = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (!end || end < Date.now()) {
      end = Date.now() + 24 * 3600 * 1000;
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    const update = () => {
      let diff = end - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const d = Math.floor(diff / 864e5);
      diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);
      diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);
      diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);

      setTimeLeft(`${pad(h + d * 24)}:${pad(m)}:${pad(s)}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-8 sm:py-14 px-4 sm:px-6 bg-[#0a0c10] overflow-hidden" id="oferta">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#181b22] to-[#0f1116] border border-white/10 p-6 sm:p-10 md:p-12 shadow-2xl text-center overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          {/* Offer Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 text-red-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Oferta de lançamento &mdash; só por hoje</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
            Kit de Tapetes Bandeja 3D Sob Medida
          </h2>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-300 mb-6">
            <span className="text-amber-400 text-sm tracking-widest" aria-hidden="true">★★★★★</span>
            <span className="font-bold text-white">{CONFIG.ratingAvg.toString().replace('.', ',')}</span>
            <span className="text-gray-500">&bull;</span>
            <span>+5.000 clientes satisfeitos</span>
          </div>

          {/* Price Container */}
          <div className="bg-[#12141a]/80 border border-white/10 rounded-2xl p-5 sm:p-7 max-w-lg mx-auto mb-8 shadow-inner">
            <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
              <s className="text-gray-400 text-base sm:text-lg font-medium">
                {formatMoney(cheapestKit.priceOld)}
              </s>
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
                {formatMoney(cheapestKit.price)}
              </span>
              <span className="bg-red-500 text-white text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-md uppercase">
                -{discountPercent}% OFF
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-400 font-bold">
              ou apenas <strong className="text-emerald-300">{formatMoney(Math.round(cheapestKit.price * 0.95))}</strong> no Pix à vista (5% OFF extra)
            </p>
          </div>

          {/* Benefits Grid (Responsive 2 cols on tablet+) */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-8 text-xs sm:text-sm text-gray-300">
            <li className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Envio <strong>GRÁTIS</strong> com rastreio para todo o Brasil</span>
            </li>
            <li className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Fabricado no <strong>molde exato</strong> do seu carro</span>
            </li>
            <li className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>12 meses</strong> de garantia oficial de fábrica</span>
            </li>
            <li className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Pagamento <strong>100% seguro</strong> com aprovação rápida</span>
            </li>
          </ul>

          {/* Urgency Countdown */}
          <div className="inline-flex items-center justify-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm text-gray-400 mb-8 max-w-full">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Preço promocional e frete grátis encerram em:{' '}
              <strong className="text-white font-mono font-bold tracking-wider">{timeLeft}</strong>
            </span>
          </div>

          {/* CTA Action Button */}
          <div>
            <a
              href="#producto"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-12 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              GARANTIR MEU DESCONTO AGORA &rarr;
            </a>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-3">
              Entrega rápida via Correios &bull; Pague com Pix ou Cartão de Crédito
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
