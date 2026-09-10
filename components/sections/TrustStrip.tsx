'use client';

import React from 'react';

export default function TrustStrip() {
  return (
    <div className="strip">
      <div className="wrap" style={{ padding: 0 }}>
        <ul>
          <li>
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <path d="M16 8h4l3 3v5h-7z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <b>Frete grátis</b>
              <small>Entrega em 2 a 5 dias úteis</small>
            </div>
          </li>

          <li>
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <b>Pagamento seguro</b>
              <small>Pix ou Cartão em até 12x</small>
            </div>
          </li>

          <li>
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
            </svg>
            <div>
              <b>7 dias</b>
              <small>Para troca ou devolução sem custo</small>
            </div>
          </li>

          <li>
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <b>12 meses</b>
              <small>De garantia real de fábrica</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
