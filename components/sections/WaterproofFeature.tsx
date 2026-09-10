'use client';

import React from 'react';

export default function WaterproofFeature() {
  return (
    <section className="sec" id="detalles">
      <div className="wrap">
        <div className="feat">
          <div className="feat-txt">
            <span className="kicker">Impermeável de verdade</span>
            <h2>Tudo o que você derramar fica retido dentro da bandeja</h2>
            <p>
              O TPE injetado de alta densidade não absorve absolutamente nada. A borda elevada
              funciona como uma barreira hermética: água, lama, areia da praia ou aquele refrigerante
              ou café que caiu sem querer ficam retidos na superfície e nunca atingem o assoalho original
              do seu carro.
            </p>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Borda de contenção perimétrica</b> de até 3 cm em todo o contorno da peça.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Superfície antiderrapante texturizada</b> com canais fluídicos que retêm a sujeira.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Limpeza rápida com mangueira.</b> Você retira em segundos, enxágua e coloca de volta.</span>
              </li>
            </ul>
          </div>

          <div className="feat-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/detalle-cobertura.webp"
              width="1100"
              height="738"
              loading="lazy"
              alt="Tapetes 3D instalados cobrindo o piso dianteiro e traseiro do veículo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
