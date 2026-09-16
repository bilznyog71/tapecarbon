'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import VideoBenefitsSection from '@/components/sections/VideoBenefitsSection';
import BeforeAfterCompare from '@/components/sections/BeforeAfterCompare';
import TrustStrip from '@/components/sections/TrustStrip';
import MaterialSection from '@/components/sections/MaterialSection';
import TechnicalSpecs from '@/components/sections/TechnicalSpecs';
import ProductConfigurator from '@/components/sections/ProductConfigurator';
import SatisfactionStats from '@/components/sections/SatisfactionStats';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FAQSection from '@/components/sections/FAQSection';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import Modals from '@/components/layout/Modals';
import MobileStickyBar from '@/components/layout/MobileStickyBar';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main id="top">
        {/* 01. Hero Cinematográfico */}
        <Hero />

        {/* 02. Benefícios em Vídeo (Carrossel Horizontal no Mobile) */}
        <VideoBenefitsSection />

        {/* 03. Comparador Antes e Depois Interativo */}
        <BeforeAfterCompare />

        {/* 04. Barra de Confiança / Benefícios (Cards lado a lado como no print) */}
        <TrustStrip />

        {/* 05. Material de Alta Performance em Vídeo */}
        <MaterialSection />

        {/* 06. Ficha Técnica Compacta */}
        <TechnicalSpecs />

        {/* 07. Produto + Galeria + Seletor de Carro + Kits + Cores e Texturas */}
        <ProductConfigurator />

        {/* 08. Números e Satisfação Garantida (+5 mil clientes) */}
        <SatisfactionStats />

        {/* 09. Avaliações com Vídeo de Clientes Reais */}
        <ReviewsSection />

        {/* 10. Perguntas Frequentes (FAQ) */}
        <FAQSection />
      </main>

      {/* 11. Rodapé Institucional */}
      <Footer />

      {/* 12. Overlays Interativos */}
      <CartDrawer />
      <CheckoutModal />
      <Modals />
      <MobileStickyBar />
    </>
  );
}
