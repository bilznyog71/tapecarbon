'use client'

import { useIntersection } from '@/hooks/useIntersection'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

const COMPARISON_ITEMS = [
  {
    aspect: 'Cobertura do assoalho',
    conventional: 'Parcial',
    tapecarbon: 'Ampla e completa',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
  {
    aspect: 'Bordas laterais',
    conventional: 'Rasas ou inexistentes',
    tapecarbon: 'Elevadas — retêm líquidos',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
  {
    aspect: 'Encaixe no veículo',
    conventional: 'Formato genérico',
    tapecarbon: 'Específico por modelo',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
  {
    aspect: 'Proteção contra água',
    conventional: 'Absorve umidade',
    tapecarbon: 'Superfície impermeável',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
  {
    aspect: 'Limpeza',
    conventional: 'Difícil — precisa secar',
    tapecarbon: 'Enxagua e recoloca',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
  {
    aspect: 'Estabilidade',
    conventional: 'Desloca durante uso',
    tapecarbon: 'Fixo por encaixe de fábrica',
    isConventionalGood: false,
    isTapecarbonGood: true,
  },
]

export default function Comparison() {
  const { ref, isVisible } = useIntersection<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className="relative bg-black section-py"
      aria-label="Comparação TAPECARBON vs tapete convencional"
    >
      <div className="container-content">
        {/* Heading */}
        <div
          className={cn(
            'text-center mb-12 transition-all duration-500',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          )}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-inter font-semibold tracking-[0.14em] uppercase text-white/60">Comparação</span>
          </div>
          <h2 className="font-manrope font-extrabold text-display-lg text-white leading-display tracking-[-0.02em]">
            Por que isso importa?
          </h2>
          <p className="text-white/50 text-[16px] font-inter mt-4 max-w-[500px] mx-auto">
            Veja lado a lado o que diferencia o TAPECARBON de um tapete convencional.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          className={cn(
            'transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '150ms' }}
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr] gap-px mb-1">
            <div className="px-4 py-3" />
            <div className="px-4 py-3 bg-graphite/60 rounded-tl-md">
              <p className="text-[10px] font-inter font-medium tracking-[0.12em] text-white/30 uppercase">
                Tapete Comum
              </p>
            </div>
            <div className="px-4 py-3 bg-accent/8 border border-accent/20 rounded-tr-md">
              <p className="text-[10px] font-inter font-medium tracking-[0.12em] text-accent uppercase">
                TAPECARBON
              </p>
            </div>
          </div>

          {/* Rows */}
          <div className="rounded-b-md overflow-hidden border border-white/6">
            {COMPARISON_ITEMS.map((item, i) => (
              <div
                key={item.aspect}
                className={cn(
                  'grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr]',
                  'border-t border-white/5 first:border-t-0',
                  i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent',
                  'transition-all duration-500',
                  isVisible ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${200 + i * 60}ms` }}
              >
                {/* Aspect */}
                <div className="px-4 py-4 flex items-center">
                  <p className="text-[13px] font-inter text-white/55 leading-snug">
                    {item.aspect}
                  </p>
                </div>

                {/* Conventional */}
                <div className="px-4 py-4 bg-graphite/20 flex items-center gap-2">
                  <X size={12} strokeWidth={2.5} className="text-white/20 flex-shrink-0" />
                  <p className="text-[12px] md:text-[13px] font-inter text-white/30 leading-snug">
                    {item.conventional}
                  </p>
                </div>

                {/* TAPECARBON */}
                <div className="px-4 py-4 bg-accent/[0.04] flex items-center gap-2">
                  <Check size={12} strokeWidth={2.5} className="text-accent flex-shrink-0" />
                  <p className="text-[12px] md:text-[13px] font-inter text-white/70 leading-snug">
                    {item.tapecarbon}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
