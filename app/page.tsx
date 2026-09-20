'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
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
import FinalUrgencyCTA from '@/components/sections/FinalUrgencyCTA';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import Modals from '@/components/layout/Modals';
import MobileStickyBar from '@/components/layout/MobileStickyBar';

export default function HomePage() {
  return (
    <>
      {/* Barra de avisos informativos (rotativa no mobile) */}
      <AnnouncementBar />

      {/* Header removido conforme solicitado — carrinho acessível via barra inferior */}

      <main id="top">
        {/* 01. Hero */}
        <Hero />

        {/* 02. Benefícios em Vídeo */}
        <VideoBenefitsSection />

        {/* 03. Comparador Antes/Depois */}
        <BeforeAfterCompare />

        {/* 04. Barra de Confiança */}
        <TrustStrip />

        {/* 05. Material */}
        <MaterialSection />

        {/* 06. Ficha Técnica */}
        <TechnicalSpecs />

        {/* 07. Produto + Galeria + Seletor + Kits */}
        <ProductConfigurator />

        {/* 08. Satisfação */}
        <SatisfactionStats />

        {/* 09. Avaliações com Vídeo */}
        <ReviewsSection />

        {/* 10. FAQ */}
        <FAQSection />

        {/* 11. CTA Final */}
        <FinalUrgencyCTA />
      </main>

      {/* Rodapé */}
      <Footer />

      {/* Overlays — carrinho, checkout, modais legais */}
      <CartDrawer />
      <CheckoutModal />
      <Modals />
      <MobileStickyBar />
    </>
  );
}
