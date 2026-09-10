'use client';

import React from 'react';

export default function DetailsGrid() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head mid">
          <span className="kicker">De perto</span>
          <h2>Detalhes que fazem a diferença</h2>
        </div>

        <div className="cols c3">
          <article className="det">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/det-material.webp"
              width="1200"
              height="800"
              loading="lazy"
              alt="Textura do TPE de alta densidade"
            />
            <div>
              <h3>TPE de alta densidade</h3>
              <p>6 mm de espessura que não deformam, não ressecam e não desbotam com o sol. Resiste a anos de uso diário intenso.</p>
            </div>
          </article>

          <article className="det">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/det-borde.webp"
              width="900"
              height="720"
              loading="lazy"
              alt="Borda elevada de contenção do tapete"
            />
            <div>
              <h3>Borda de contenção</h3>
              <p>O perímetro elevado retém água, barro, sujeira e areia antes que cheguem ao carpete de fábrica do seu veículo.</p>
            </div>
          </article>

          <article className="det">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/det-ojal.webp"
              width="900"
              height="900"
              loading="lazy"
              alt="Ilhós metálico e trava de fixação do tapete"
            />
            <div>
              <h3>Ilhoses de fábrica</h3>
              <p>Travamento seguro nas ancoragens originais do assoalho. Não escorrega para a frente nem interfere nos pedais.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
