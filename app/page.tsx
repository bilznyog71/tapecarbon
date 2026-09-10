'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import LaunchOffer from '@/components/sections/LaunchOffer';
import TopProof from '@/components/sections/TopProof';
import ProductConfigurator from '@/components/sections/ProductConfigurator';
import WarrantySeal from '@/components/sections/WarrantySeal';
import TrustStrip from '@/components/sections/TrustStrip';
import WaterproofFeature from '@/components/sections/WaterproofFeature';
import BeforeAfterCompare from '@/components/sections/BeforeAfterCompare';
import OriginalFitFeature from '@/components/sections/OriginalFitFeature';
import DetailsGrid from '@/components/sections/DetailsGrid';
import ComparisonTable from '@/components/sections/ComparisonTable';
import TechnicalSpecs from '@/components/sections/TechnicalSpecs';
import SatisfactionStats from '@/components/sections/SatisfactionStats';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalUrgencyCTA from '@/components/sections/FinalUrgencyCTA';
import CompanySection from '@/components/sections/CompanySection';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import Modals from '@/components/layout/Modals';
import RecentPurchases from '@/components/layout/RecentPurchases';
import MobileStickyBar from '@/components/layout/MobileStickyBar';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main id="top">
        {/* 01. Hero Cinematográfico */}
        <Hero />

        {/* 02. Oferta de Lançamento */}
        <LaunchOffer />

        {/* 03. Prova Social Antecipada com Fotos */}
        <TopProof />

        {/* 04. Produto + Galeria Dinâmica + Seletor de Carro 3D + Kits + Cores */}
        <ProductConfigurator />

        {/* 05. Garantia de 12 Meses e 7 Dias CDC */}
        <WarrantySeal />

        {/* 06. Tira de Confiança / Diferenciais */}
        <TrustStrip />

        {/* 07. Impermeável de Verdade */}
        <WaterproofFeature />

        {/* 08. Comparador Antes e Depois Deslizante */}
        <BeforeAfterCompare />

        {/* 09. Fixação Original nos Pinos de Fábrica */}
        <OriginalFitFeature />

        {/* 10. Detalhes Técnicos de Perto */}
        <DetailsGrid />

        {/* 11. Comparativa TapeCarbon vs Comum */}
        <ComparisonTable />

        {/* 12. Ficha Técnica Completa */}
        <TechnicalSpecs />

        {/* 13. Números e Satisfação Garantida */}
        <SatisfactionStats />

        {/* 14. Mural de Avaliações com Fotos */}
        <ReviewsSection />

        {/* 15. Perguntas Frequentes (FAQ) */}
        <FAQSection />

        {/* 16. CTA Final de Urgência */}
        <FinalUrgencyCTA />

        {/* 17. A Empresa */}
        <CompanySection />
      </main>

      {/* 18. Rodapé Institucional */}
      <Footer />

      {/* 19. Overlays Interativos */}
      <CartDrawer />
      <CheckoutModal />
      <Modals />
      <RecentPurchases />
      <MobileStickyBar />
    </>
  );
}
