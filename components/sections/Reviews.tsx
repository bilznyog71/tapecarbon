'use client'

import Image from 'next/image'
import Container from '@/components/ui/Container'
import { Star, Check } from 'lucide-react'

// Dados ilustrativos de demonstração para layout (ambiente de desenvolvimento/mock)
const DEMO_REVIEWS = [
  {
    id: '1',
    name: 'Matheus Guimarães',
    city: 'São Paulo, SP',
    vehicle: 'Toyota Corolla Cross 2024',
    rating: 5,
    avatar: '/cap-assets/review-user1.jpg',
    text: 'Confesso que fiquei com receio antes de comprar, mas o encaixe é perfeito. As travas originais deixaram tudo firme e não escorrega nada. Acabamento de primeira linha!',
  },
  {
    id: '2',
    name: 'Carolina Rezende',
    city: 'Rio de Janeiro, RJ',
    vehicle: 'Jeep Compass 2023',
    rating: 5,
    avatar: '/cap-assets/review-user2.jpg',
    text: 'O molde a laser é exato. As bordas elevadas já me salvaram com suco derramado pelas crianças. É só tirar, passar água e fica novo em folha.',
  },
  {
    id: '3',
    name: 'Lucas Ramalho',
    city: 'Curitiba, PR',
    vehicle: 'BMW 320i M Sport 2024',
    rating: 5,
    avatar: '/cap-assets/review-user3.jpg',
    text: 'A borracha TPE não tem cheiro nenhum e o visual fosco combinou perfeitamente com o interior do carro. Produto premium de verdade.',
  },
]

export default function Reviews() {
  return (
    <section
      id="avaliacoes"
      className="bg-[#F7F7F5] py-14 sm:py-20 lg:py-24 text-neutral-900 overflow-hidden"
      aria-label="Avaliações de Clientes"
    >
      <Container>
        
        {/* Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[12px] font-bold text-[#00B84A] uppercase tracking-[0.1em] block mb-2">
            Prova Social
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-900 tracking-tight leading-[1.15] mb-3">
            Quem comprou, aprovou.
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 font-medium">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-neutral-900">4.8</span>
            <span>•</span>
            <span>Mais de 640 avaliações de clientes</span>
          </div>
        </div>

        {/* ── Cards: 3 colunas no desktop (lg), 2 no tablet (md), 1 coluna no mobile ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-[12px] p-6 flex flex-col justify-between w-full min-w-0"
              style={{
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                border: 'none',
              }}
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-neutral-100">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-neutral-900 truncate">
                      {rev.name}
                    </h3>
                    <p className="text-[13px] text-neutral-500 truncate">
                      {rev.city}
                    </p>
                  </div>
                </div>

                {/* Stars & Vehicle Tag */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[12px] font-medium text-neutral-500 truncate">
                    {rev.vehicle}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-[1.55] font-normal">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Verified Badge */}
              <div className="mt-6 pt-3.5 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-[#00B84A] font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Compra verificada</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}
