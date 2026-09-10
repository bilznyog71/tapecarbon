'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { ArrowRight } from 'lucide-react'

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX)
      }
    },
    [isDragging, handleMove]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    },
    [isDragging, handleMove]
  )

  return (
    <section
      id="antes-depois"
      className="bg-white py-16 sm:py-20 lg:py-24 text-neutral-900"
      aria-label="Antes e Depois"
    >
      <Container>
        <div className="w-full max-w-[1000px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[12px] font-bold text-[#00B84A] uppercase tracking-[0.1em] block mb-2">
            Comparativo Real
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-900 tracking-tight leading-[1.15] mb-3">
            A diferença é visível.
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 font-normal max-w-xl mx-auto">
            Arraste para comparar o assoalho com carpete convencional versus a proteção sob medida TAPECARBON.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] rounded-[12px] overflow-hidden select-none touch-none cursor-ew-resize bg-black shadow-lg"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          aria-label="Comparador antes e depois"
          tabIndex={0}
        >
          {/* After (TAPECARBON) */}
          <Image
            src="/cap-assets/depois1.webp"
            alt="Depois com tapetes TAPECARBON 3D"
            fill
            priority
            className="object-cover pointer-events-none"
            sizes="(max-width: 1024px) 100vw, 1000px"
          />

          {/* Before (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src="/cap-assets/antes1.webp"
              alt="Antes com carpete comum desgastado"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1000px"
            />
          </div>

          {/* Clean Badges */}
          <span className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-[6px] tracking-wider pointer-events-none uppercase">
            Antes
          </span>
          <span className="absolute bottom-4 right-4 bg-[#00B84A] text-white text-[11px] font-bold px-3 py-1 rounded-[6px] tracking-wider pointer-events-none uppercase">
            Depois (TAPECARBON)
          </span>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.6)]"
            style={{ left: `calc(${sliderPosition}% - 1px)` }}
          />

          {/* Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none text-neutral-800"
            style={{ left: `${sliderPosition}%` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="#produto-compra"
            className="inline-flex items-center justify-center gap-2.5 px-8 h-[48px] bg-[#00B84A] hover:bg-[#009e3f] text-white text-[13px] font-bold tracking-wider uppercase rounded-[8px] transition-colors shadow-sm"
          >
            <span>Configurar Meu Carro</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

      </div>
      </Container>
    </section>
  )
}
