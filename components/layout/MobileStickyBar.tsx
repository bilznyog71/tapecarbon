'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { formatMoney } from '@/data/config';

export default function MobileStickyBar() {
  const { selectedKit, formattedVehicle, addToCart } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const bottom = hero.getBoundingClientRect().bottom;
        setIsVisible(bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mbar ${isVisible ? 'on' : ''}`} id="mbar">
      <div className="i">
        <b id="mb-price">{formatMoney(selectedKit.price)}</b>
        <small id="mb-label">{formattedVehicle || 'Escolha seu veículo'}</small>
      </div>
      <button className="btn btn-buy" onClick={addToCart}>
        Adicionar
      </button>
    </div>
  );
}
