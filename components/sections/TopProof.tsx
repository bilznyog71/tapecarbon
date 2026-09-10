'use client';

import React from 'react';
import { REVIEWS_DATA } from '@/data/reviews';

export default function TopProof() {
  const topReviews = REVIEWS_DATA.filter(r => r.photo).slice(0, 3);

  return (
    <section className="sec sec-soft">
      <div className="wrap">
        <div className="sec-head mid">
          <span className="kicker">Já têm o produto</span>
          <h2>O que dizem os clientes que já compraram e instalaram</h2>
          <p>Com fotos do produto real instalado no carro de cada cliente.</p>
        </div>

        <div className="revs" id="revs-top">
          {topReviews.map(r => {
            const initials = r.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <article className="rev" key={r.id}>
                <span className="rev-tag">Foto do cliente</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="rev-foto"
                  src={`/assets/img/${r.photo}`}
                  alt={`Tapete TapeCarbon instalado no ${r.vehicle}`}
                  loading="lazy"
                />
                <div className="rev-hd">
                  <span className="rev-av">{initials}</span>
                  <div>
                    <b>{r.name}</b>
                    <small>{r.city}, {r.state} · {r.vehicle}</small>
                  </div>
                </div>
                <div className="stars" aria-label="5 de 5">★★★★★</div>
                <p>{r.text}</p>
                <span className="ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Compra verificada
                </span>
              </article>
            );
          })}
        </div>

        <p className="mid" style={{ textAlign: 'center', marginTop: '26px' }}>
          <a className="btn btn-line" href="#opiniones">
            Ver todas as {REVIEWS_DATA.length} avaliações
          </a>
        </p>
      </div>
    </section>
  );
}
