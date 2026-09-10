'use client'

import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20o%20kit%20TAPECARBON%20para%20o%20meu%20carro."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-[76px] lg:bottom-6 right-4 lg:right-6 z-[80] w-[48px] h-[48px] lg:w-[52px] lg:h-[52px] flex items-center justify-center rounded-full bg-[#00B84A] text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
      style={{ boxShadow: '0 8px 24px -4px rgba(0, 184, 74, 0.45)' }}
    >
      <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 fill-white" />
    </a>
  )
}
