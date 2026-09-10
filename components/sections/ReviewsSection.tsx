'use client';

import React, { useState } from 'react';
import { REVIEWS_DATA } from '@/data/reviews';
import { CONFIG } from '@/data/config';

export default function ReviewsSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? REVIEWS_DATA : REVIEWS_DATA.slice(0, 6);

  return (
    <section className="sec" id="opiniones">
      <div className="wrap">
        <div className="sec-head mid">
          <span className="kicker">O que dizem</span>
          <h2>Avaliações de clientes</h2>
          <p>Com fotos do produto instalado no veículo de cada um.</p>
        </div>

        {/* Resumo das notas */}
        <div className="rev-top">
          <div>
            <div className="rev-big">{CONFIG.ratingAvg.toString().replace('.', ',')}</div>
            <div className="stars" aria-hidden="true">★★★★★</div>
            <small style={{ color: 'var(--ink-3)', fontSize: '12.5px' }}>
              {CONFIG.reviewCount} avaliações
            </small>
          </div>

          <div className="rev-bars">
            <div className="rb">
              <span>5★</span>
              <span className="t"><i style={{ width: '91%' }}></i></span>
              <span>91%</span>
            </div>
            <div className="rb">
              <span>4★</span>
              <span className="t"><i style={{ width: '7%' }}></i></span>
              <span>7%</span>
            </div>
            <div className="rb">
              <span>3★</span>
              <span className="t"><i style={{ width: '2%' }}></i></span>
              <span>2%</span>
            </div>
            <div className="rb">
              <span>2★</span>
              <span className="t"><i style={{ width: '0%' }}></i></span>
              <span>0%</span>
            </div>
            <div className="rb">
              <span>1★</span>
              <span className="t"><i style={{ width: '0%' }}></i></span>
              <span>0%</span>
            </div>
          </div>
        </div>

        {/* Grade de depoimentos */}
        <div className="revs" id="revs">
          {displayedReviews.map(r => {
            const initials = r.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <article className="rev" key={r.id}>
                {r.photo && (
                  <>
                    <span className="rev-tag">Foto do cliente</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="rev-foto"
                      src={`/assets/img/${r.photo}`}
                      alt={`Tapete AlfaCarbon instalado no ${r.vehicle}`}
                      loading="lazy"
                    />
                  </>
                )}
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

        {!showAll && (
          <p style={{ marginTop: '26px', textAlign: 'center' }}>
            <button className="btn btn-line" onClick={() => setShowAll(true)}>
              Ver todas as avaliações ({REVIEWS_DATA.length})
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
