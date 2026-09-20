'use client';

import React, { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'Frete grátis para todo o Brasil',
  'Envio com rastreamento via Correios',
  '5% de desconto no Pix',
  'Garantia de 7 dias',
];

export default function AnnouncementBar() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate every 3s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="announce" id="announce" role="region" aria-label="Informações de envio">
      {/* Desktop: inline side-by-side */}
      <div className="announce-desktop">
        {MESSAGES.map((msg, i) => (
          <React.Fragment key={i}>
            <span>{msg}</span>
            {i < MESSAGES.length - 1 && (
              <span aria-hidden="true" className="announce-dot">·</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: single rotating message */}
      <div className="announce-mobile" aria-live="polite" aria-atomic="true">
        {MESSAGES.map((msg, i) => (
          <span
            key={i}
            className={`announce-slide${i === active ? ' on' : ''}`}
            aria-hidden={i !== active}
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
