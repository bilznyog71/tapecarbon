'use client'

import Image from 'next/image'
import Container from '@/components/ui/Container'
import { Shield, Droplets, Check } from 'lucide-react'

export default function FeatureExplorer() {
  return (
    <section
      id="tecnologia"
      className="bg-[#F7F7F5] py-16 sm:py-20 lg:py-24 text-neutral-900"
      aria-label="Qualidade e Tecnologia"
    >
      <Container>
        
        {/* ── Bloco 1: Material TPE e Bordas 3D (Texto Esquerda + Foto Direita) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(2,minmax(0,1fr))] gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className="w-full min-w-0 flex flex-col items-start">
            <span className="text-[12px] font-bold text-[#00B84A] uppercase tracking-[0.1em] mb-2">
              Composto Termoplástico TPE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-900 tracking-tight leading-[1.15] mb-5">
              Borracha nobre resistente a calor extremo.
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-6 max-w-[500px]">
              Diferente de borrachas convencionais que soltam cheiro forte no sol quente, o TPE automotivo mantém estabilidade estrutural até 180°C sem ressecar ou deformar.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00B84A]/10 text-[#00B84A] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Inodoro e Atóxico</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Livre de cheiro de borracha queimada ou compostos voláteis.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00B84A]/10 text-[#00B84A] flex items-center justify-center shrink-0 mt-0.5">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Bordas de 4 a 6 cm de Altura</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Formato concha que não deixa líquidos transbordarem para o carpete.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full min-w-0">
            <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden bg-white shadow-sm">
              <Image
                src="/cap-assets/prod5.png"
                alt="Textura e acabamento da borracha TPE TAPECARBON"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* ── Bloco 2: Instalação e Travas de Fábrica (Foto Esquerda + Texto Direita) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(2,minmax(0,1fr))] gap-8 lg:gap-16 items-center">
          <div className="w-full min-w-0 order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden bg-white shadow-sm">
              <Image
                src="/cap-assets/prod4.png"
                alt="Travas de fixação originais integradas ao tapete"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="w-full min-w-0 order-1 lg:order-2 flex flex-col items-start">
            <span className="text-[12px] font-bold text-[#00B84A] uppercase tracking-[0.1em] mb-2">
              Segurança ao Volante
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-900 tracking-tight leading-[1.15] mb-5">
              Travamento nos pontos originais de fábrica.
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-6 max-w-[500px]">
              Tapetes sem fixação podem escorregar e prender no pedal de freio ou acelerador. A TAPECARBON inclui os mesmos pontos de engate do seu carro para segurança absoluta.
            </p>

            <ul className="space-y-3.5">
              {[
                'Encaixe direto nos pinos originais do assoalho',
                'Base antiderrapante com garras que aderem ao carpete',
                'Molde preciso que respeita o curso de todos os pedais',
                'Acabamento acetinado que valoriza o interior',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00B84A]/10 text-[#00B84A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-neutral-700 font-medium">
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
