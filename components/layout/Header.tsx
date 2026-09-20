'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG } from '@/data/config';

export default function Header() {
  const { cart, openCart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.length;

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`hdr${scrolled ? ' scrolled' : ''}`} id="hdr">
      <div className="wrap">
        {/* Burger — mobile left */}
        <button
          className="icon-btn burger"
          id="burger"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mnav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ order: -1 }}
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>

        {/* Logo */}
        <a className="logo" href="#top" aria-label="AlfaCarbon — início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/logo.png"
            alt="AlfaCarbon"
            width="121"
            height="38"
            style={{ filter: 'brightness(0) saturate(100%)' }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="mainnav" aria-label="Principal">
          <a href="#producto">Produto</a>
          <a href="#detalles">Tecnologia</a>
          <a href="#opiniones">Avaliações</a>
          <a href="#preguntas">Dúvidas</a>
        </nav>

        {/* Right actions */}
        <div className="hdr-right">
          {/* Cart */}
          <button
            className="icon-btn"
            id="cart-btn"
            aria-label={`Abrir carrinho${cartCount > 0 ? ` (${cartCount} item${cartCount > 1 ? 's' : ''})` : ''}`}
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="badge" id="cart-n" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>

          {/* CTA desktop */}
          <a
            href="#producto"
            className="btn btn-buy"
            style={{
              display: 'none',
              padding: '10px 18px',
              fontSize: '14px',
              minHeight: '40px',
            }}
            id="hdr-cta"
          >
            Encontrar meu carro
          </a>
        </div>
      </div>

      {/* Mobile menu — full screen overlay */}
      <nav
        className={`mnav${isMenuOpen ? ' on' : ''}`}
        id="mnav"
        aria-label="Menu Mobile"
        aria-hidden={!isMenuOpen}
      >
        {/* Header inside menu */}
        <div className="mnav-hd">
          <a className="logo" href="#top" onClick={closeMenu} aria-label="AlfaCarbon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/logo.png"
              alt="AlfaCarbon"
              width="100"
              height="32"
              style={{ filter: 'brightness(0) saturate(100%)' }}
            />
          </a>
          <button
            className="icon-btn"
            onClick={closeMenu}
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="mnav-inner">
          <a href="#producto" onClick={closeMenu}>Produto</a>
          <a href="#detalles" onClick={closeMenu}>Tecnologia</a>
          <a href="#opiniones" onClick={closeMenu}>Avaliações</a>
          <a href="#preguntas" onClick={closeMenu}>Perguntas frequentes</a>

          {/* WhatsApp link */}
          <a
            className="mnav-wa"
            href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de tirar uma dúvida sobre os tapetes bandeja 3D.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.122 1.529 5.855L.057 23.5l5.796-1.52A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.57-.476-5.07-1.31l-.363-.215-3.44.903.918-3.35-.236-.374A10 10 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Fale conosco pelo WhatsApp
          </a>
        </div>
      </nav>
    </header>
  );
}
