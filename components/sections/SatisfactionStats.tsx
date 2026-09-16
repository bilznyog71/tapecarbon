'use client';

import React, { useRef, useEffect, useState } from 'react';

const SATISFACTION_IMAGES = [
  { src: '/images/7.jpg', alt: 'Cliente com produto instalado' },
  { src: '/images/foto1.png', alt: 'Tapete sob medida instalado' },
  { src: '/images/6.jpg', alt: 'Cliente satisfeito' },
  { src: '/images/5.jpg', alt: 'Interior do veículo protegido' },
  { src: '/images/4.png', alt: 'Acabamento perfeito' },
  { src: '/images/3.jpg', alt: 'Proteção completa do assoalho' },
  { src: '/images/2.jpg', alt: 'Encaixe nos pinos de fábrica' },
  { src: '/images/1.jpg', alt: 'Cliente satisfeito com tapete AlfaCarbon' },
  { src: '/images/foto2.jpg', alt: 'Tapete bandeja em detalhes' },
  { src: '/images/foto3.jpg', alt: 'Textura e durabilidade' },
  { src: '/images/foto4.jpg', alt: 'Borda alta de retenção' },
  { src: '/images/foto5.webp', alt: 'Jogo completo instalado' }
];

export default function SatisfactionStats() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.75; // Pixels per frame

    const tick = () => {
      if (!isPaused && track) {
        offsetRef.current += speed;
        // The track has 2 sets of images, reset halfway
        const halfWidth = track.scrollWidth / 2;
        if (offsetRef.current >= halfWidth) {
          offsetRef.current = 0;
        }
        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused]);

  // Duplicate items for seamless continuous looping
  const duplicatedItems = [...SATISFACTION_IMAGES, ...SATISFACTION_IMAGES];

  return (
    <section className="relative py-16 md:py-24 bg-[#0a0c10] overflow-hidden" id="satisfacao-garantida">
      {/* Title */}
      <div className="wrap max-w-7xl mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-wider uppercase leading-none">
          SATISFAÇÃO<br />
          <span className="text-red-500">GARANTIDA</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
          Veja registros reais enviados por quem já equipou o carro com os nossos tapetes bandeja 3D.
        </p>
      </div>

      {/* Infinite Horizontal Carousel Container */}
      <div
        className="relative w-full overflow-hidden select-none py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Continuous Track */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {duplicatedItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl bg-[#171a21] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Floating Badge (Centered Overlay) */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-[#17191E]/95 border border-white/20 rounded-full px-6 py-2.5 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center ring-2 ring-red-500/30">
            <span className="text-base md:text-lg font-black text-white leading-tight">
              +5 mil
            </span>
            <span className="text-[11px] md:text-xs text-red-400 font-bold uppercase tracking-wider">
              clientes satisfeitos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
