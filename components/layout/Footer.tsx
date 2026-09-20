'use client';

import React from 'react';
import { CONFIG } from '@/data/config';
import { useStore } from '@/hooks/useStore';

export default function Footer() {
  const { openModal } = useStore();

  return (
    <footer className="ftr" id="ftr">
      <div className="wrap">
        {/* Main grid */}
        <div className="ftr-grid">
          {/* Column 1: Brand */}
          <div>
            <a className="logo" href="#top" aria-label="AlfaCarbon — início" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/logo.png"
                alt="AlfaCarbon"
                width="130"
                height="44"
                style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1) opacity(0.9)' }}
              />
            </a>
            <p style={{ fontSize: '14px', lineHeight: 1.65, marginTop: '12px', maxWidth: '32ch' }}>
              Tapetes automotivos 3D sob medida.
              Proteção desenvolvida para acompanhar o formato do seu veículo.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {[
                { href: `https://instagram.com/alfacarbon`, label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z' },
                { href: `https://facebook.com/alfacarbon`, label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-strong)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--ink-3)',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--gold-2)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4>Produtos</h4>
            <ul>
              <li><a href="#producto">Tapetes Dianteiros</a></li>
              <li><a href="#producto">Kit Completo</a></li>
              <li><a href="#producto">Kit + Porta-malas</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4>Ajuda</h4>
            <ul>
              <li><a href="#producto">Encontrar meu carro</a></li>
              <li><a href="#preguntas">Perguntas frequentes</a></li>
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de rastrear meu pedido.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rastrear pedido
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Policies */}
          <div>
            <h4>Contato</h4>
            <ul>
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de tirar uma dúvida.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li><a href={`mailto:${CONFIG.email}`}>E-mail</a></li>
            </ul>

            <h4 style={{ marginTop: '22px' }}>Políticas</h4>
            <ul>
              <li><button type="button" onClick={() => openModal('terminos')}>Termos de uso</button></li>
              <li><button type="button" onClick={() => openModal('privacidade')}>Privacidade</button></li>
              <li><button type="button" onClick={() => openModal('cambios')}>Trocas e devoluções</button></li>
              <li><button type="button" onClick={() => openModal('envios')}>Prazos de envio</button></li>
            </ul>

            {/* Payment methods */}
            <div className="pays" style={{ marginTop: '18px' }}>
              {['PIX', 'VISA', 'MASTER', 'ELO', 'BOLETO'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-btm">
          <span>© {new Date().getFullYear()} AlfaCarbon Brasil. Todos os direitos reservados.</span>
          <span>PIX · VISA · MASTER · BOLETO</span>
        </div>
      </div>
    </footer>
  );
}
