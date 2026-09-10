'use client';

import React from 'react';
import { CONFIG, formatMoney } from '@/data/config';

export default function Hero() {
  const lowestPrice = Math.min(...CONFIG.kits.map(k => k.price));

  return (
    <section className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-bg"
        src="/assets/img/ambiente-onix.webp"
        alt="Interior de veículo com tapete 3D instalado"
        width="1400"
        height="932"
      />
      <div className="hero-body">
        <div className="wrap">
          <span className="hero-kicker">Tapetes bandeja 3D sob medida</span>
          <h1 className="hero-title">
            Proteja o assoalho<br />do seu carro
          </h1>
          <p className="hero-sub">
            Molde exclusivo da sua marca, modelo e ano. Borda elevada que retém a água,
            a lama e a areia antes que cheguem ao seu carpete original.
          </p>

          <div className="hero-rate">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <span><b>{CONFIG.ratingAvg.toString().replace('.', ',')}</b> · {CONFIG.reviewCount} avaliações</span>
          </div>

          <div className="hero-cta">
            <a className="btn btn-buy btn-hero" href="#producto">
              Montar meu kit sob medida
            </a>
            <span className="hero-price">
              a partir de <b>{formatMoney(lowestPrice)}</b>
              <small>Frete grátis para todo o Brasil</small>
            </span>
          </div>
        </div>
      </div>

      <a className="hero-down" href="#producto" aria-label="Ver o produto">
        <span></span>
      </a>
    </section>
  );
}
