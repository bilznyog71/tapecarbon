'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '@/data/config';

export default function SatisfactionStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [numModels, setNumModels] = useState(0);
  const [numWaterproof, setNumWaterproof] = useState(0);
  const [numWarranty, setNumWarranty] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (animated || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 80) {
        setAnimated(true);

        const duration = 1200;
        const startTime = Date.now();

        const step = () => {
          const progress = Math.min(1, (Date.now() - startTime) / duration);
          const ease = 1 - Math.pow(1 - progress, 3);

          setNumModels(Math.round(500 * ease));
          setNumWaterproof(Math.round(100 * ease));
          setNumWarranty(Math.round(12 * ease));

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setNumModels(500);
            setNumWaterproof(100);
            setNumWarranty(12);
          }
        };

        requestAnimationFrame(step);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  return (
    <section className="sec sec-dark garantia-blk" ref={containerRef}>
      <div className="wrap">
        <div className="sec-head mid">
          <h2>Satisfação garantida</h2>
          <p>Mais de <b>{CONFIG.customersServed}</b> veículos protegidos em todo o Brasil</p>
          <p className="garantia-stars">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <b>{CONFIG.ratingAvg.toString().replace('.', ',')}</b> — 98% de satisfação dos clientes
          </p>
        </div>

        <div className="nums" id="nums">
          <div>
            <b>{numModels}+</b>
            <small>Modelos compatíveis</small>
          </div>
          <div>
            <b>{numWaterproof}%</b>
            <small>Impermeável</small>
          </div>
          <div>
            <b>{numWarranty}</b>
            <small>Meses de garantia</small>
          </div>
        </div>
      </div>
    </section>
  );
}
