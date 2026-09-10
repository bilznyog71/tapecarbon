'use client'

import Image from 'next/image'
import Container from '@/components/ui/Container'

const BRAND_LOGOS = [
  { name: 'Toyota', src: '/cap-assets/brand-toyota.png' },
  { name: 'Volkswagen', src: '/cap-assets/brand-volkswagen.png' },
  { name: 'Hyundai', src: '/cap-assets/brand-hyundai.png' },
  { name: 'Chevrolet', src: '/cap-assets/brand-chevrolet.png' },
  { name: 'Nissan', src: '/cap-assets/brand-nissan.png' },
  { name: 'Ford', src: '/cap-assets/brand-ford.png' },
  { name: 'Kia', src: '/cap-assets/brand-kia.png' },
  { name: 'Peugeot', src: '/cap-assets/brand-peugeot.png' },
  { name: 'Citroën', src: '/cap-assets/brand-citroen.png' },
  { name: 'GWM', src: '/cap-assets/brand-gwm.png' },
  { name: 'Chery', src: '/cap-assets/brand-chery.png' },
  { name: 'Subaru', src: '/cap-assets/brand-subaru.png' },
  { name: 'Suzuki', src: '/cap-assets/brand-suzuki.png' },
  { name: 'Mazda', src: '/cap-assets/brand-mazda.png' },
  { name: 'JAC', src: '/cap-assets/brand-jac.png' },
]

export default function BrandsMarquee() {
  return (
    <section className="bg-white py-14 lg:py-16 overflow-hidden">
      <Container>
        {/* Title */}
        <div className="max-w-[700px] mx-auto text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
            Disponível para todas as marcas e modelos
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
            Fabricados sob medida de acordo com a marca, modelo e ano do seu veículo
          </p>
        </div>

        {/* Monochromatic Logos Row inside Container */}
        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-8 sm:gap-12 items-center py-2">
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="shrink-0 flex items-center justify-center h-10 w-28 sm:w-32"
              >
                <Image
                  src={brand.src}
                  alt={`${brand.name} logo`}
                  width={110}
                  height={40}
                  className="max-h-8 sm:max-h-9 w-auto object-contain filter grayscale opacity-[0.55] hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
