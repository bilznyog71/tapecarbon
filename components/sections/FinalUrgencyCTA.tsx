'use client';

import React from 'react';
import { CONFIG } from '@/data/config';

/** CTA dark premium — sem contagem regressiva, sem urgência artificial */
export default function FinalUrgencyCTA() {
  return (
    <section
      className="sec sec-dark-theme"
      id="cta-final"
      style={{
        textAlign: 'center',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="wrap narrow" style={{ maxWidth: '660px' }}>
        {/* Eyebrow */}
        <span
          className="kicker"
          style={{ marginBottom: '16px', display: 'inline-block' }}
        >
          Proteção para o seu patrimônio
        </span>

        <h2
          style={{
            fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
            marginBottom: '16px',
            color: '#fff',
          }}
        >
          O tapete certo para o seu carro está aqui.
        </h2>

        <p
          style={{
            fontSize: '1rem',
            maxWidth: '50ch',
            margin: '0 auto 32px',
            color: 'var(--ink-2)',
            lineHeight: 1.7,
          }}
        >
          Selecione seu veículo, escolha o kit e receba em casa com frete
          grátis e garantia de 7 dias. Sem burocracia.
        </p>

        {/* CTA Group */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          <a
            href="#producto"
            className="btn btn-buy"
            style={{ padding: '16px 36px', fontSize: '16px' }}
            id="final-cta-btn"
          >
            Montar meu kit agora
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

          <a
            href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de tirar uma dúvida antes de comprar.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ padding: '16px 28px', fontSize: '15px' }}
          >
            Falar com especialista
          </a>
        </div>

        {/* Small assurances */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px 24px',
          }}
        >
          {['Frete grátis para todo o Brasil', 'Garantia de 7 dias', '5% de desconto no Pix'].map(item => (
            <span
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--ink-3)',
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green-dark)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
