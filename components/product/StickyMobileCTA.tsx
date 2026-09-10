'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hide if near the bottom of page (footer)
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight

      const isNearFooter = scrollY + winHeight > docHeight - 350
      const isPastHero = scrollY > 400

      setIsVisible(isPastHero && !isNearFooter)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[70] sm:hidden',
        'transition-transform duration-300 ease-out',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-900/95 backdrop-blur-md shadow-2xl border-t border-neutral-800 safe-area-bottom">
        <div className="min-w-0">
          <p className="font-extrabold text-xs text-white truncate">
            Kit Tapetes 3D sob Medida
          </p>
          <p className="text-[11px] text-[#00B84A] font-bold">
            A partir de R$ 149,00
          </p>
        </div>

        <Link
          href="#produto-compra"
          tabIndex={isVisible ? 0 : -1}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#00B84A] hover:bg-[#009e3f] active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] flex-shrink-0 shadow transition-all"
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          <span>Comprar</span>
        </Link>
      </div>
    </div>
  )
}
