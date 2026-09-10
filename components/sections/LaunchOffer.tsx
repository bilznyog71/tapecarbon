'use client';

import React, { useState, useEffect } from 'react';
import { CONFIG, formatMoney, formatInstallment } from '@/data/config';

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
    <section className="oferta">
      <div className="wrap">
        <div className="oferta-card">
          <span className="oferta-flag">Oferta de lançamento &mdash; só por hoje</span>

          <h2>Kit de tapetes 3D sob medida para o seu veículo</h2>
          <p className="oferta-rate">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <b>{CONFIG.ratingAvg.toString().replace('.', ',')}</b> · {CONFIG.reviewCount} avaliações verificadas
          </p>

          <p className="oferta-precio">
            <s id="of-was">{formatMoney(cheapestKit.priceOld)}</s>
            <b id="of-now">{formatMoney(cheapestKit.price)}</b>
            <span className="oferta-off" id="of-off">-{discountPercent}%</span>
          </p>
          <p className="oferta-cuotas">
            ou <b id="of-cuota">{formatInstallment(cheapestKit.price)}</b> no cartão ou Pix
          </p>

          <ul className="oferta-lista">
            <li>
              <span>Envio <b>GRÁTIS</b> com código de rastreio para todo o Brasil</span>
            </li>
            <li>
              <span>Fabricado com o <b>molde exato</b> da sua marca, modelo e ano</span>
            </li>
            <li>
              <span><b>12 meses</b> de garantia de fábrica + 7 dias para testar</span>
            </li>
            <li>
              <span>Pagamento <b>100% seguro</b> e protegido via Pix ou Cartão</span>
            </li>
          </ul>

          <p className="oferta-timer" id="of-timer">
            O desconto de <b>{discountPercent}% OFF</b> e o frete grátis encerram em{' '}
            <time id="of-clock">{timeLeft}</time>
          </p>

          <a className="btn btn-buy oferta-cta" href="#producto">
            COMPRAR AGORA · {formatMoney(cheapestKit.price)} &rarr;
          </a>
          <p className="oferta-mp">Pix com aprovação imediata ou Cartão de Crédito em até 12x</p>
        </div>
      </div>
    </section>
  );
}
