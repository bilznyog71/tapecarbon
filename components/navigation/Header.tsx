'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import Container from '@/components/ui/Container'

interface HeaderProps {
  cartCount?: number
  onCartOpen?: () => void
}

const NAV_LINKS = [
  { href: '#produto-compra', label: 'Produtos' },
  { href: '#tecnologia', label: 'Como funciona' },
  { href: '#beneficios', label: 'Por que TAPECARBON' },
  { href: '#avaliacoes', label: 'Avaliações' },
  { href: '#faq', label: 'Dúvidas' },
]

export default function Header({ cartCount = 0, onCartOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className="w-full bg-[#0A0A0A] text-white flex items-center h-[62px] lg:h-[72px] relative z-50 border-b border-white/[0.06]"
        role="banner"
      >
        <Container className="flex items-center justify-between">
          
          {/* Mobile Left: Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-white/80 hover:text-white"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Logo (Left on desktop, center on mobile) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 focus:outline-none"
            aria-label="TAPECARBON — Página Inicial"
          >
            <span className="font-extrabold tracking-[0.06em] text-xl lg:text-2xl text-white">
              TAPE<span className="text-[#00B84A]">CARBON</span>
            </span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-9"
            aria-label="Navegação Principal"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-white/70 hover:text-white transition-colors duration-150 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search (Desktop) */}
            <button
              onClick={() => {
                const el = document.getElementById('produto-compra')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="hidden lg:flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition-colors"
              aria-label="Buscar veículo"
            >
              <Search className="w-[19px] h-[19px]" />
            </button>

            {/* Buy / Configurator Shortcut Button */}
            <button
              onClick={() => {
                const el = document.getElementById('produto-compra')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="relative p-2 text-white/80 hover:text-[#00B84A] transition-colors cursor-pointer"
              aria-label="Comprar agora"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* CTA Button (Desktop) */}
            <Link
              href="#produto-compra"
              className="hidden lg:inline-flex items-center justify-center px-5 h-[42px] bg-[#00B84A] hover:bg-[#009e3f] text-white text-[13px] font-bold uppercase tracking-wider rounded-[8px] transition-colors shadow-sm whitespace-nowrap"
            >
              Encontrar meu carro
            </Link>
          </div>

        </Container>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-[280px] max-w-[85vw] h-full bg-[#0A0A0A] p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                <span className="font-extrabold text-lg text-white">
                  TAPE<span className="text-[#00B84A]">CARBON</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-semibold text-white/80 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link
              href="#produto-compra"
              className="w-full py-3.5 bg-[#00B84A] text-white text-xs font-bold uppercase tracking-wider rounded-[8px] text-center"
              onClick={() => setMobileOpen(false)}
            >
              Encontrar meu carro
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
