'use client';

import React from 'react';
import { CONFIG } from '@/data/config';
import { useStore } from '@/hooks/useStore';

export default function Footer() {
  const { openModal } = useStore();

  return (
    <footer className="ftr border-t border-white/10 bg-[#0c0e12] text-gray-400 text-sm">
      <div className="wrap max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Descrição (sem logo branca) */}
          <div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 font-medium">
              Especializada em tapetes automotivos sob medida tipo bandeja 3D, produzidos nas dimensões exatas do seu veículo para proteger o interior contra água, barro, poeira e desgaste.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Sob medida para cada veículo</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Envio com rastreio para todo o Brasil</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Atendimento humanizado via WhatsApp</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Compra 100% segura com garantia</li>
            </ul>
          </div>

          {/* Coluna 2: Institucional */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider text-xs">Institucional</h4>
            <ul className="space-y-2.5">
              <li><button type="button" onClick={() => openModal('empresa')} className="hover:text-white transition-colors">Quem somos</button></li>
              <li><button type="button" onClick={() => openModal('privacidade')} className="hover:text-white transition-colors">Política de privacidade</button></li>
              <li><button type="button" onClick={() => openModal('terminos')} className="hover:text-white transition-colors">Termos de uso</button></li>
              <li><button type="button" onClick={() => openModal('cambios')} className="hover:text-white transition-colors">Trocas e devoluções</button></li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda e Rastreamento */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider text-xs">Ajuda</h4>
            <ul className="space-y-2.5">
              <li><button type="button" onClick={() => openModal('envios')} className="hover:text-white transition-colors">Prazos de envio e frete</button></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Perguntas frequentes</a></li>
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de saber o status do meu pedido.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Rastreamento do pedido
                </a>
              </li>
              <li><a href={`mailto:${CONFIG.email}`} className="hover:text-white transition-colors">Envie um e-mail</a></li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Atendimento (sem CNPJ nem endereço) */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider text-xs">Contato & Atendimento</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed">
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, tenho uma dúvida sobre a AlfaCarbon.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-amber-400 transition-colors block text-sm"
                >
                  WhatsApp: {CONFIG.whatsappLabel}
                </a>
              </li>
              <li>{CONFIG.email}</li>
              <li>{CONFIG.hours}</li>
            </ul>
          </div>
        </div>

        {/* ── Bloco: Formas de Envio & Pagamento ── */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 text-center md:text-left">
              Formas de Envio
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Correios */}
              <span
                className="bg-white/10 rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm"
                title="Correios"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/correios.svg"
                  alt="Correios"
                  className="h-4.5 max-h-[18px] w-auto object-contain"
                />
              </span>

              {/* SEDEX */}
              <span
                className="bg-white/10 rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm"
                title="SEDEX"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/sedex.svg"
                  alt="SEDEX"
                  className="h-4.5 max-h-[18px] w-auto object-contain"
                />
              </span>

              {/* PAC */}
              <span
                className="bg-white/10 rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm"
                title="PAC"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/pac.svg"
                  alt="PAC"
                  className="h-4.5 max-h-[18px] w-auto object-contain"
                />
              </span>
            </div>
          </div>

          {/* Formas de Pagamento (apenas PIX, sem cartões de crédito) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 text-center md:text-right">
              Formas de Pagamento
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="px-3 py-1 rounded bg-emerald-500/20 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                PIX à vista (5% OFF)
              </span>
            </div>
          </div>
        </div>

        {/* Linha Final de Copyright (sem CNPJ) */}
        <div className="pt-8 border-t border-white/10 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} {CONFIG.brand} Brasil. Todos os direitos reservados.</span>
          <span>Preços e condições exclusivos para compras no site oficial.</span>
        </div>
      </div>
    </footer>
  );
}
