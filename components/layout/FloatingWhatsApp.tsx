'use client'

import { MessageCircle } from 'lucide-react'
import { CONFIG } from '@/data/config'

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre o kit TAPECARBON para o meu carro.')}`}
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
