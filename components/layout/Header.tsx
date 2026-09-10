'use client';

import React, { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG } from '@/data/config';

export default function Header() {
  const { cart, openCart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.length;

  return (
    <header className="hdr" id="hdr">
      <div className="wrap">
        <a className="logo" href="#top" aria-label="AlfaCarbon — início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo.png" alt="AlfaCarbon" width="121" height="42" />
        </a>

        <nav className="mainnav" aria-label="Principal">
          <a href="#producto">Produto</a>
          <a href="#detalles">Detalhes</a>
          <a href="#opiniones">Avaliações</a>
          <a href="#preguntas">Perguntas</a>
          <a href="#empresa">Empresa</a>
        </nav>

        <div className="hdr-right">
          <button
            className="icon-btn"
            id="cart-btn"
            aria-label="Abrir carrinho"
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="badge" id="cart-n">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="icon-btn burger"
            id="burger"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mnav"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg viewBox="0 0 24 24" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      <nav className={`mnav ${isMenuOpen ? 'on' : ''}`} id="mnav" aria-label="Menu Mobile">
        <a href="#producto" onClick={() => setIsMenuOpen(false)}>Produto</a>
        <a href="#detalles" onClick={() => setIsMenuOpen(false)}>Detalhes</a>
        <a href="#opiniones" onClick={() => setIsMenuOpen(false)}>Avaliações</a>
        <a href="#preguntas" onClick={() => setIsMenuOpen(false)}>Perguntas frequentes</a>
        <a href="#empresa" onClick={() => setIsMenuOpen(false)}>Empresa</a>
        <a
          href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de tirar uma dúvida sobre os tapetes bandeja 3D.')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fale conosco pelo WhatsApp
        </a>
      </nav>
    </header>
  );
}
