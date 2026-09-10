'use client'

import Image from 'next/image'
import Container from '@/components/ui/Container'
import { Check } from 'lucide-react'

const BENEFITS = [
  'Ajuste milimétrico a laser que acompanha as curvas exatas do assoalho.',
  'Bordas altas de contenção que retêm até 3 litros de líquidos e terra.',
  'Travas de fixação originais para que o tapete não deslize em direção aos pedais.',
  'Borracha termoplástica TPE 100% impermeável e sem cheiro forte.',
  'Fácil manutenção: basta retirar, enxaguar com água e reinstalar.',
]

export default function BenefitsTransition() {
  return (
    <section
      id="beneficios"
      className="bg-white py-16 sm:py-20 lg:py-24 text-neutral-900"
      aria-label="Por que TAPECARBON"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(2,minmax(0,1fr))] gap-8 lg:gap-16 items-center">
          
          {/* Image (50%) */}
          <div className="w-full min-w-0 order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden bg-neutral-100 shadow-sm">
              <Image
                src="/cap-assets/prod-gallery-11.png"
                alt="Interior do carro protegido com tapetes TAPECARBON"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text (50%) */}
          <div className="w-full min-w-0 order-1 lg:order-2 flex flex-col items-start">
            <span className="text-[12px] font-bold text-[#00B84A] uppercase tracking-[0.1em] mb-2">
              Por que escolher TAPECARBON
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-900 tracking-tight leading-[1.15] mb-5">
              Engenharia feita para proteger o seu patrimônio.
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-8 max-w-[500px]">
              Diferente de tapetes universais que ficam soltos e dobram com o tempo, o tapete tipo bandeja TAPECARBON é modelado com precisão para o chassi exato do seu veículo.
            </p>

            <ul className="space-y-4">
              {BENEFITS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00B84A]/10 text-[#00B84A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-neutral-700 font-medium leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Container>
    </section>
  )
}
