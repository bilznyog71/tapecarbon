'use client';

import React, { useState, useEffect } from 'react';

interface PurchaseEvent {
  name: string;
  city: string;
  vehicle: string;
  timeAgo: string;
}

const PURCHASES: PurchaseEvent[] = [
  { name: 'Marcos O.', city: 'São Paulo - SP', vehicle: 'Toyota Hilux', timeAgo: 'Há 4 minutos' },
  { name: 'Carlos E.', city: 'Curitiba - PR', vehicle: 'VW Polo Track', timeAgo: 'Há 9 minutos' },
  { name: 'Renata M.', city: 'Belo Horizonte - MG', vehicle: 'Jeep Renegade', timeAgo: 'Há 14 minutos' },
  { name: 'Rodrigo S.', city: 'Florianópolis - SC', vehicle: 'Fiat Toro', timeAgo: 'Há 22 minutos' },
  { name: 'Juliana P.', city: 'Porto Alegre - RS', vehicle: 'Hyundai Creta', timeAgo: 'Há 31 minutos' },
  { name: 'Eduardo F.', city: 'Goiânia - GO', vehicle: 'Chevrolet Tracker', timeAgo: 'Há 45 minutos' },
];

export default function RecentPurchases() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const cycle = () => {
      showTimeout = setTimeout(() => {
        setIsVisible(true);
        hideTimeout = setTimeout(() => {
          setIsVisible(false);
          setCurrentIdx(prev => (prev + 1) % PURCHASES.length);
          cycle();
        }, 5200);
      }, 12000);
    };

    // Primeira exibição após 8 segundos
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
        setCurrentIdx(prev => (prev + 1) % PURCHASES.length);
        cycle();
      }, 5200);
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const item = PURCHASES[currentIdx];

  return (
    <aside
      className={`pop ${isVisible ? 'on' : ''}`}
      id="pop"
      role="status"
      aria-live="polite"
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pop-img"
        src="/assets/img/kit-full-negro.webp"
        alt="Tapete 3D"
        width="52"
        height="52"
      />
      <div className="pop-txt">
        <b>{item.name}, de {item.city}</b>
        <small>Comprou para seu {item.vehicle}</small>
        <span className="pop-hace">{item.timeAgo}</span>
      </div>
      <button
        className="pop-x"
        onClick={() => setIsDismissed(true)}
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </aside>
  );
}
