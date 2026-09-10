'use client';

import React, { useState, useEffect } from 'react';

export default function FinalUrgencyCTA() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

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
        setTime({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      const d = Math.floor(diff / 864e5);
      diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);
      diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);
      diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);

      setTime({
        d: pad(d),
        h: pad(h),
        m: pad(m),
        s: pad(s)
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="sec sec-dark final">
      <div className="wrap narrow">
        <h2>A oferta termina em</h2>

        <div className="clock">
          <div>
            <b id="c-d">{time.d}</b>
            <small>Dias</small>
          </div>
          <div>
            <b id="c-h">{time.h}</b>
            <small>Horas</small>
          </div>
          <div>
            <b id="c-m">{time.m}</b>
            <small>Min</small>
          </div>
          <div>
            <b id="c-s">{time.s}</b>
            <small>Seg</small>
          </div>
        </div>

        <p style={{ marginBottom: '22px' }}>
          Após o encerramento do cronômetro os kits retornam ao preço original de tabela.
        </p>

        <p>
          <a className="btn btn-buy" href="#producto" style={{ padding: '16px 34px' }}>
            Montar meu kit sob medida
          </a>
        </p>
      </div>
    </section>
  );
}
