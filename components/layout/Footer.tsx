'use client';

import React from 'react';
import { CONFIG } from '@/data/config';
import { useStore } from '@/hooks/useStore';

export default function Footer() {
  const { openModal } = useStore();

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <a className="logo" href="#top" style={{ marginBottom: '14px' }} aria-label="AlfaCarbon início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo.png" alt="AlfaCarbon" width="133" height="46" />
            </a>
            <p style={{ maxWidth: '36ch' }}>
              Tapetes automotivos bandeja 3D sob medida para o assoalho do seu carro. Envio para todo o Brasil.
            </p>
          </div>

          <div>
            <h4>Institucional</h4>
            <ul>
              <li><button type="button" onClick={() => openModal('empresa')}>Quem somos</button></li>
              <li><button type="button" onClick={() => openModal('privacidade')}>Política de privacidade</button></li>
              <li><button type="button" onClick={() => openModal('terminos')}>Termos de uso</button></li>
              <li><button type="button" onClick={() => openModal('cambios')}>Trocas e devoluções</button></li>
            </ul>
          </div>

          <div>
            <h4>Ajuda</h4>
            <ul>
              <li><button type="button" onClick={() => openModal('envios')}>Prazos de envio e frete</button></li>
              <li><a href="#preguntas">Perguntas frequentes</a></li>
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de saber o status do meu pedido.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rastreamento do pedido
                </a>
              </li>
              <li><a href={`mailto:${CONFIG.email}`}>Envie um e-mail</a></li>
            </ul>
          </div>

          <div>
            <h4>Contato</h4>
            <ul>
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, tenho uma dúvida sobre a AlfaCarbon.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp: {CONFIG.whatsappLabel}
                </a>
              </li>
              <li><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
              <li style={{ color: 'var(--ink-3)', fontSize: '13.5px' }}>{CONFIG.hours}</li>
              <li style={{ color: 'var(--ink-3)', fontSize: '13.5px' }}>{CONFIG.address}</li>
              <li style={{ color: 'var(--ink-3)', fontSize: '13.5px' }}>CNPJ: {CONFIG.cnpj}</li>
            </ul>
          </div>
        </div>

        <div className="ftr-btm">
          <span>&copy; {new Date().getFullYear()} {CONFIG.brand} Brasil. Todos os direitos reservados.</span>
          <span>Preços em reais (R$), impostos inclusos. CNPJ: {CONFIG.cnpj}. Imagens meramente ilustrativas.</span>
        </div>
      </div>
    </footer>
  );
}
