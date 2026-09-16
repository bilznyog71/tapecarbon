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
          {/* Coluna 1: Logo e Descrição */}
          <div>
            <a className="logo inline-block mb-4" href="#top" aria-label="AlfaCarbon início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo.png" alt="AlfaCarbon" width="140" height="48" className="h-9 w-auto" />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
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

          {/* Coluna 4: Contato */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider text-xs">Contato & Atendimento</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed">
              <li>
                <a
                  href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, tenho uma dúvida sobre a AlfaCarbon.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-400 transition-colors block text-sm"
                >
                  WhatsApp: {CONFIG.whatsappLabel}
                </a>
              </li>
              <li>{CONFIG.email}</li>
              <li>{CONFIG.hours}</li>
              <li>{CONFIG.address}</li>
              <li>CNPJ: {CONFIG.cnpj}</li>
            </ul>
          </div>
        </div>

        {/* ── Bloco: Formas de Envio (Correios, SEDEX, PAC) ── */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 text-center md:text-left">
              Formas de Envio
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Correios */}
              <span
                className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm transition-transform hover:scale-105"
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
                className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm transition-transform hover:scale-105"
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
                className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center h-8 shadow-sm transition-transform hover:scale-105"
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

          {/* Formas de Pagamento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 text-center md:text-right">
              Nós Aceitamos
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold text-white border border-white/10">VISA</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold text-white border border-white/10">MASTERCARD</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold text-white border border-white/10">ELO</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold text-white border border-white/10">AMEX</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">PIX (5% OFF)</span>
            </div>
          </div>
        </div>

        {/* Linha Final de Copyright */}
        <div className="pt-8 border-t border-white/10 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} {CONFIG.brand} Brasil. Todos os direitos reservados.</span>
          <span>Preços e condições exclusivos para compras no site oficial. CNPJ: {CONFIG.cnpj}.</span>
        </div>
      </div>
    </footer>
  );
}
