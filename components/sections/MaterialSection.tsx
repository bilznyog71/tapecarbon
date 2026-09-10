'use client'

import Image from 'next/image'
import { useIntersection } from '@/hooks/useIntersection'
import { cn } from '@/lib/utils'

export default function MaterialSection() {
  const { ref, isVisible } = useIntersection<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className="relative bg-carbon section-py overflow-hidden border-t border-white/5"
      aria-label="Material e construção"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image — macro texture */}
          <div
            className={cn(
              'relative rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ aspectRatio: '4/3' }}
            aria-label="Detalhe macro do material TAPECARBON"
          >
            <Image
              src="/images/product-main.webp"
              alt="Polímero TPE automotivo de alta densidade TAPECARBON com ranhuras e bordas elevadas"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(140,198,63,0.06) 0%, transparent 60%), linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 40%)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div
            className={cn(
              'transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[11px] font-inter font-semibold tracking-[0.14em] uppercase text-white/60">Material</span>
            </div>

            <h2 className="font-manrope font-extrabold text-display-lg text-white leading-display tracking-[-0.02em] mb-8">
              Feito para durar.<br />
              <span className="text-white/50">Fácil de manter.</span>
            </h2>

            {/* Properties */}
            <div className="space-y-0 divide-y divide-white/[0.06] mb-8">
              {[
                {
                  title: 'Impermeável',
                  description:
                    'A superfície não absorve líquidos. Água, café, lama — tudo fica contido sem penetrar no material.',
                },
                {
                  title: 'Resistente',
                  description:
                    'Material de alta densidade desenvolvido para suportar o uso intenso do dia a dia sem deformar ou rasgar.',
                },
                {
                  title: 'Fácil de limpar',
                  description:
                    'Retire o tapete, sacuda ou enxágue com água. Seca rapidamente e volta ao lugar como novo.',
                },
                {
                  title: 'Acabamento integrado',
                  description:
                    'Textura e coloração desenvolvidas para complementar o interior original do veículo, sem parecer um item genérico.',
                },
              ].map((prop, i) => (
                <div
                  key={prop.title}
                  className={cn(
                    'py-6 transition-all duration-500',
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  )}
                  style={{ transitionDelay: `${300 + i * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="w-px h-full bg-accent flex-shrink-0 self-stretch min-h-[4px] max-h-5 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-manrope font-bold text-[17px] text-white tracking-tight mb-1.5">
                        {prop.title}
                      </h3>
                      <p className="text-[14px] text-white/50 font-inter leading-[1.65]">
                        {prop.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
