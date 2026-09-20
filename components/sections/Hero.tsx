'use client';

import React from 'react';
import { CONFIG, formatMoney } from '@/data/config';

const BENEFITS = [
  'Molde digital 1:1 para o seu modelo',
  'Borda de contenção 3D até 3 cm',
  'Material TPE impermeável e inodoro',
];

export default function Hero() {
  const lowestPrice = Math.min(...CONFIG.kits.map(k => k.price));

  return (
    <section className="hero" id="top">
      {/* Background — real product photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-bg"
        src="/assets/img/ambiente-onix.webp"
        alt="Interior de veículo com tapete AlfaCarbon instalado"
        width="1400"
        height="932"
        fetchPriority="high"
      />

      <div className="hero-body">
        <div className="wrap">
          {/* Max width container for content */}
          <div style={{ maxWidth: '620px' }}>
            <span className="hero-kicker">Tapetes bandeja 3D · sob medida</span>

            <h1 className="hero-title">
              Proteção definitiva,<br />
              desenhada milímetro<br />
              a milímetro para<br />
              o seu carro.
            </h1>

            <p className="hero-sub">
              Molde exclusivo da sua marca, modelo e ano. Borda elevada que
              retém água, lama e areia antes que cheguem ao carpete original.
            </p>

            {/* CTA */}
            <div className="hero-cta">
              <a className="btn btn-buy btn-hero" href="#producto" id="hero-cta-btn">
                Escolher meu veículo
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <span
                style={{
                  fontSize: '13px',
                  color: 'rgba(195, 205, 215, 0.75)',
                  lineHeight: '1.4',
                }}
              >
                A partir de{' '}
                <strong style={{ color: '#fff', fontSize: '17px' }}>
                  {formatMoney(lowestPrice)}
                </strong>
                <br />
                <span style={{ fontSize: '12px' }}>Frete grátis · todo o Brasil</span>
              </span>
            </div>

            {/* Benefit bullets — no fake ratings */}
            <div className="hero-benefits">
              {BENEFITS.map(benefit => (
                <span key={benefit} className="hero-benefit-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
