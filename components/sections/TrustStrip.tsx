'use client';

import React, { useRef, useState } from 'react';

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h3l3 5v3h-6V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Envio rápido',
    subtitle: 'Rastreio em até 24h',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Atendimento humano',
    subtitle: 'WhatsApp em horário comercial',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: '5% no Pix',
    subtitle: 'Aprovação imediata',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Compra protegida',
    subtitle: 'Garantia de 7 dias',
  },
];

export default function TrustStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track which card is visible (for dots)
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / TRUST_ITEMS.length;
    const idx = Math.round(el.scrollLeft / cardW);
    setActive(Math.min(idx, TRUST_ITEMS.length - 1));
  };

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / TRUST_ITEMS.length;
    el.scrollTo({ left: i * cardW, behavior: 'smooth' });
    setActive(i);
  };

  return (
    <section
      id="confianca"
      style={{
        borderTop: '1px solid var(--line-light)',
        borderBottom: '1px solid var(--line-light)',
        background: 'var(--bg-light)',
        paddingBlock: 'clamp(20px, 3vw, 32px)',
      }}
    >
      {/* ── Desktop: 4 colunas fixas ── */}
      <div className="wrap trust-grid-desktop">
        {TRUST_ITEMS.map(item => (
          <div className="trust-card" key={item.title}>
            <span className="trust-icon">{item.icon}</span>
            <div>
              <span className="trust-title">{item.title}</span>
              <span className="trust-sub">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile: carrossel swipeable ── */}
      <div className="trust-carousel-wrap">
        <div
          ref={scrollRef}
          className="trust-carousel"
          onScroll={handleScroll}
        >
          {TRUST_ITEMS.map(item => (
            <div className="trust-card trust-card-mobile" key={item.title}>
              <span className="trust-icon">{item.icon}</span>
              <div>
                <span className="trust-title">{item.title}</span>
                <span className="trust-sub">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="trust-dots" role="tablist" aria-label="Navegar benefícios">
          {TRUST_ITEMS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Benefício ${i + 1}`}
              className={`trust-dot${i === active ? ' on' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Desktop: grid visível */
        .trust-grid-desktop {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        /* Mobile: grid escondido, carrossel visível */
        .trust-carousel-wrap { display: none; }

        .trust-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg-light-soft);
          border: 1px solid var(--line-light);
          border-radius: var(--r-l);
        }
        .trust-icon {
          color: var(--gold);
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .trust-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink-lt);
          line-height: 1.3;
        }
        .trust-sub {
          display: block;
          font-size: 11.5px;
          color: var(--ink-lt-3);
          margin-top: 2px;
          line-height: 1.4;
        }

        /* Carousel styles */
        .trust-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 0;
          padding: 0 clamp(16px, 5vw, 24px);
        }
        .trust-carousel::-webkit-scrollbar { display: none; }
        .trust-card-mobile {
          scroll-snap-align: center;
          flex: 0 0 calc(100vw - clamp(32px, 10vw, 48px));
          max-width: 360px;
          margin: 0 6px;
          border-radius: var(--r-l);
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
        }

        /* Dots */
        .trust-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .trust-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--line-light-strong);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .trust-dot.on {
          background: var(--gold);
          transform: scale(1.4);
        }

        @media (max-width: 660px) {
          .trust-grid-desktop { display: none !important; }
          .trust-carousel-wrap { display: block; }
        }
        @media (max-width: 768px) and (min-width: 661px) {
          .trust-grid-desktop { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
