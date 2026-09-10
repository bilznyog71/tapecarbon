'use client';

import React from 'react';

export default function OriginalFitFeature() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="feat flip">
          <div className="feat-txt">
            <span className="kicker">Fixação original</span>
            <h2>Encaixa nos pinos e travas de fábrica do seu carro</h2>
            <p>
              Não leva cola, fita adesiva, velcro nem parafusos. A peça vem com os ilhoses
              moldados na posição milimétrica das fixações originais do seu veículo, travando
              com firmeza absoluta e impedindo que o tapete escorregue para a frente ao frear.
              Retira e coloca de volta em menos de um minuto.
            </p>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Segurança total:</b> não desliza em direção aos pedais do motorista.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Preservação do veículo:</b> o carpete de fábrica fica 100% protegido e sem marcas.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Instalação sem ferramentas:</b> você mesmo coloca no lugar com facilidade.</span>
              </li>
            </ul>
          </div>

          <div className="feat-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/ojal-fijacion.webp"
              width="1400"
              height="933"
              loading="lazy"
              alt="Detalhe do ilhós do tapete encaixado no pino de fixação original do assoalho"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
