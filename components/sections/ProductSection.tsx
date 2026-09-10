'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  ShieldCheck,
  Zap,
  Lock,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOCK_BRANDS,
  getModelsByBrand,
  getYearsByModel,
  type VehicleBrand,
  type VehicleModel,
} from '@/data/vehicles'

const GALLERY_IMAGES = [
  { id: '1', src: '/cap-assets/prod-gallery-1.png', alt: 'Kit Premium Tapetes 3D — Vista Completa' },
  { id: '2', src: '/cap-assets/prod-gallery-2.png', alt: 'Tapetes Dianteiros e Traseiros em TPE' },
  { id: '3', src: '/cap-assets/prod-gallery-3.png', alt: 'Encaixe e Acabamento Premium' },
  { id: '4', src: '/cap-assets/prod-gallery-4.webp', alt: 'Borda Elevada Anti-Derramamento' },
  { id: '5', src: '/cap-assets/prod-gallery-5.webp', alt: 'Bandeja Dianteira com Travas de Segurança' },
  { id: '6', src: '/cap-assets/prod-gallery-6.webp', alt: 'Tapete Traseiro Inteiriço com Túnel' },
  { id: '7', src: '/cap-assets/prod-gallery-7.webp', alt: 'Superfície Antiderrapante e Textura' },
  { id: '8', src: '/cap-assets/prod-gallery-8.webp', alt: 'Fácil Lavagem e Remoção Rápida' },
  { id: '9', src: '/cap-assets/prod-gallery-9.webp', alt: 'Bandeja do Porta-Malas Resistente' },
  { id: '10', src: '/cap-assets/prod-gallery-10.png', alt: 'Detalhe da Borda Alta e Resistência' },
  { id: '11', src: '/cap-assets/prod-gallery-11.png', alt: 'Interior Completo Protegido' },
]

export const TEXTURES = [
  {
    id: 'circuito-tech',
    name: 'Circuito / Tech',
    image: '/textures/txt1.webp',
  },
  {
    id: 'fluxo-ondas',
    name: 'Fluxo / Ondas',
    image: '/textures/foto3.webp',
  },
  {
    id: 'pedra-offroad',
    name: 'Pedra / Off-Road',
    image: '/textures/txtpedra.webp',
  },
]

export const COLORS = [
  { id: 'preto', name: 'Preto Carbon', hex: '#1C1C1C' },
  { id: 'cinza', name: 'Cinza Grafite', hex: '#4A4D52' },
  { id: 'bege', name: 'Bege Camel', hex: '#C2A37E' },
]

const KITS = [
  {
    id: 'completo',
    name: 'Kit Completo (Cabine + Porta-Malas)',
    description: 'Dianteiros + Traseiros Inteiriço + Bandeja do Porta-Malas',
    price: 247,
    priceFormatted: 'R$ 247,00',
    installments: 'ou 12x de R$ 24,70 sem juros',
    badge: 'Mais Vendido (61% OFF)',
  },
  {
    id: 'basico',
    name: 'Kit Cabine (Sem Porta-Malas)',
    description: 'Dianteiros + Traseiros Inteiriço com cobertura de túnel',
    price: 197,
    priceFormatted: 'R$ 197,00',
    installments: 'ou 12x de R$ 19,70 sem juros',
    badge: null,
  },
]

export default function ProductSection() {
  const router = useRouter()
  const [activeIdx, setActiveIdx] = useState(0)

  // Configurator state
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [selectedModelId, setSelectedModelId] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number | ''>('')
  const [selectedTextureId, setSelectedTextureId] = useState<string>('circuito-tech')
  const [selectedColorId, setSelectedColorId] = useState<string>('preto')
  const [selectedKitId, setSelectedKitId] = useState<string>('completo')

  const [validationError, setValidationError] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const selectedBrand = MOCK_BRANDS.find((b) => b.id === selectedBrandId) ?? null
  const availableModels = selectedBrand ? getModelsByBrand(selectedBrand.id) : []
  const selectedModel = availableModels.find((m) => m.id === selectedModelId) ?? null
  const availableYears = selectedModel
    ? getYearsByModel(selectedModel.id)
    : Array.from({ length: 27 }, (_, i) => 2026 - i)

  const selectedKit = KITS.find((k) => k.id === selectedKitId) ?? KITS[0]
  const selectedTexture = TEXTURES.find((t) => t.id === selectedTextureId) ?? TEXTURES[0]
  const selectedColor = COLORS.find((c) => c.id === selectedColorId) ?? COLORS[0]

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId)
    setSelectedModelId('')
    setSelectedYear('')
    setValidationError(null)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId)
    setSelectedYear('')
    setValidationError(null)
  }

  const handleYearChange = (yearStr: string) => {
    setSelectedYear(yearStr ? Number(yearStr) : '')
    setValidationError(null)
  }

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1))
  }

  const handleNext = () => {
    setActiveIdx((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0))
  }

  const handleBuyClick = () => {
    if (!selectedBrand) {
      setValidationError('Selecione a marca do seu veículo para continuar.')
      const el = document.getElementById('vehicle-configurator')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (!selectedModel) {
      setValidationError('Selecione o modelo do seu veículo para continuar.')
      const el = document.getElementById('vehicle-configurator')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setValidationError(null)
    // Abre a revisão do pedido igual ao NobreCar
    setIsReviewModalOpen(true)
  }

  const handleProceedToCheckout = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set('marca', selectedBrand.name)
    if (selectedModel) params.set('modelo', selectedModel.name)
    if (selectedYear) params.set('ano', String(selectedYear))
    params.set('kit', selectedKit.name)
    params.set('textura', selectedTexture.name)
    params.set('cor', selectedColor.name)
    params.set('amount', String(selectedKit.price))

    setIsReviewModalOpen(false)
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <section
      id="produto-compra"
      className="bg-[#F7F7F5] py-16 sm:py-20 lg:py-24 text-neutral-900"
      aria-label="Comprar TAPECARBON 3D"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: Gallery ── */}
          <div className="w-full min-w-0">
            <div className="lg:sticky lg:top-28">
              {/* Main Image */}
              <div className="relative aspect-square w-full rounded-[14px] bg-white overflow-hidden p-6 sm:p-10 shadow-sm flex items-center justify-center border border-[#EBEBEB]">
                <Image
                  src={GALLERY_IMAGES[activeIdx].src}
                  alt={GALLERY_IMAGES[activeIdx].alt}
                  fill
                  priority
                  className="w-full h-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />

                {/* Subtle Nav Arrows */}
                <button
                  onClick={handlePrev}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow transition-transform active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow transition-transform active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none w-full min-w-0 max-w-full">
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      'shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-[10px] overflow-hidden bg-white p-1 transition-all cursor-pointer',
                      activeIdx === i
                        ? 'border-2 border-[#00B84A] opacity-100 shadow-sm'
                        : 'border border-[#E3E3E3] opacity-65 hover:opacity-100'
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={`Miniatura ${i + 1}`}
                      width={75}
                      height={75}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Information & Configurator ── */}
          <div className="w-full min-w-0 flex flex-col">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-extrabold text-[#00B84A] uppercase tracking-[0.1em]">
                TAPECARBON 3D ORIGINAL
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#001A33] text-white uppercase tracking-wider">
                61% OFF HOJE
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight mb-2">
              Tapete Bandeja 3D Sob Medida
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-700">4.9</span>
              <span className="text-neutral-400">•</span>
              <span className="text-sm text-neutral-500 underline font-medium">842 avaliações no Brasil</span>
            </div>

            {/* Price & Installments */}
            <div className="mb-5 bg-white p-4 rounded-[12px] border border-[#E5E5E5] shadow-sm">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                    {selectedKit.priceFormatted}
                  </span>
                  <span className="text-xs text-neutral-400 line-through font-semibold">
                    {selectedKit.id === 'completo' ? 'R$ 630,00' : 'R$ 490,00'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#00B84A] uppercase bg-[#EBF8F0] px-2.5 py-1 rounded-full">
                  Frete Grátis
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
                {selectedKit.installments} ou com 5% de desconto no Pix
              </p>
            </div>

            {/* ── Vehicle Selectors ── */}
            <div id="vehicle-configurator" className="mb-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-600 mb-2.5">
                1. Selecione seu veículo
              </h3>

              {validationError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-[8px] text-xs font-bold text-red-700">
                  {validationError}
                </div>
              )}

              <div className="space-y-3">
                {/* Marca */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Marca
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrandId}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="w-full h-[48px] appearance-none rounded-[10px] bg-white border border-[#D8D8D8] px-4 pr-10 text-[14px] font-medium text-neutral-900 focus:outline-none focus:border-[#00B84A] focus:ring-1 focus:ring-[#00B84A] transition-colors"
                    >
                      <option value="">Selecione a marca...</option>
                      {MOCK_BRANDS.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Modelo
                  </label>
                  <div className="relative">
                    <select
                      disabled={!selectedBrandId}
                      value={selectedModelId}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full h-[48px] appearance-none rounded-[10px] bg-white border border-[#D8D8D8] px-4 pr-10 text-[14px] font-medium text-neutral-900 focus:outline-none focus:border-[#00B84A] focus:ring-1 focus:ring-[#00B84A] transition-colors disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedBrandId ? 'Selecione o modelo...' : 'Aguardando marca...'}
                      </option>
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Ano
                  </label>
                  <div className="relative">
                    <select
                      disabled={!selectedBrandId}
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      className="w-full h-[48px] appearance-none rounded-[10px] bg-white border border-[#D8D8D8] px-4 pr-10 text-[14px] font-medium text-neutral-900 focus:outline-none focus:border-[#00B84A] focus:ring-1 focus:ring-[#00B84A] transition-colors disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedBrandId ? 'Selecione o ano...' : 'Aguardando modelo...'}
                      </option>
                      {availableYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                      ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TEXTURA (Exatamente como NobreCar) ── */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-600 mb-2.5">
                2. TEXTURA
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {TEXTURES.map((tex) => {
                  const isSelected = selectedTextureId === tex.id
                  return (
                    <button
                      key={tex.id}
                      type="button"
                      onClick={() => setSelectedTextureId(tex.id)}
                      className={cn(
                        'bg-white rounded-[12px] p-2 sm:p-2.5 text-center cursor-pointer transition-all flex flex-col items-center',
                        isSelected
                          ? 'border-2 border-[#00B84A] shadow-[0_0_0_2px_rgba(0,184,74,0.15)]'
                          : 'border border-[#E3E3E3] hover:border-neutral-400 opacity-80 hover:opacity-100'
                      )}
                    >
                      <div className="relative w-full aspect-square rounded-[8px] overflow-hidden bg-neutral-100 mb-2">
                        <Image
                          src={tex.image}
                          alt={tex.name}
                          fill
                          sizes="(max-width: 640px) 30vw, 150px"
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#00B84A] text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-800 leading-tight">
                        {tex.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── COR DO TAPETE ── */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-600 mb-2">
                3. COR DO ACABAMENTO
              </label>
              <div className="flex items-center gap-3">
                {COLORS.map((cor) => {
                  const isSelected = selectedColorId === cor.id
                  return (
                    <button
                      key={cor.id}
                      type="button"
                      onClick={() => setSelectedColorId(cor.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-[8px] bg-white border cursor-pointer transition-all',
                        isSelected
                          ? 'border-[#00B84A] shadow-sm ring-1 ring-[#00B84A]'
                          : 'border-[#D8D8D8] hover:border-neutral-400'
                      )}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: cor.hex }}
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        {cor.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Kit Options ── */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-600 mb-2.5">
                4. ESCOLHA O KIT
              </label>

              <div className="space-y-2.5">
                {KITS.map((kit) => {
                  const isSelected = selectedKitId === kit.id
                  return (
                    <div
                      key={kit.id}
                      onClick={() => setSelectedKitId(kit.id)}
                      className={cn(
                        'p-3.5 sm:p-4 rounded-[10px] cursor-pointer transition-all flex items-center justify-between gap-3 bg-white',
                        isSelected
                          ? 'border-[2px] border-[#00B84A] shadow-sm'
                          : 'border border-[#E3E3E3] hover:border-neutral-400'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                            isSelected
                              ? 'border-[#00B84A] bg-[#00B84A] text-white'
                              : 'border-neutral-300 bg-white'
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-neutral-900">
                              {kit.name}
                            </span>
                            {kit.badge && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#00B84A]/15 text-[#00B84A] uppercase whitespace-nowrap">
                                {kit.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-neutral-500 font-normal truncate mt-0.5">
                            {kit.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm sm:text-base font-extrabold text-neutral-900 shrink-0">
                        {kit.priceFormatted}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA Button — NobreCar Style: Direct to Checkout */}
            <button
              onClick={handleBuyClick}
              className="w-full h-[54px] bg-[#00B84A] hover:bg-[#009e3f] active:scale-[0.99] text-white font-extrabold uppercase text-[15px] tracking-wider rounded-[10px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mb-3"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>COMPRAR AGORA COM 61% OFF</span>
            </button>

            {/* Micro Info */}
            <div className="flex items-center justify-center gap-1.5 text-center text-xs text-neutral-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#00B84A]" />
              <span>Pagamento 100% processado em ambiente seguro e criptografado</span>
            </div>

          </div>

        </div>
      </Container>

      {/* ── MODAL DE REVISÃO DO PEDIDO (IGUAL AO NOBRECAR) ── */}
      {isReviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 border border-neutral-100"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
              <div>
                <h3 className="text-lg font-black text-neutral-900">
                  Revisão do Pedido
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                  Confirme os dados antes de prosseguir para o pagamento
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Marca:</span>
                <span className="font-extrabold text-neutral-900">{selectedBrand?.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Modelo:</span>
                <span className="font-extrabold text-neutral-900">{selectedModel?.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Ano:</span>
                <span className="font-extrabold text-neutral-900">{selectedYear || 'Todos os anos'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Textura:</span>
                <span className="font-extrabold text-neutral-900 text-[#00B84A]">{selectedTexture.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Cor:</span>
                <span className="font-extrabold text-neutral-900">{selectedColor.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-700">Kit:</span>
                <span className="font-extrabold text-neutral-900">{selectedKit.name}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-base">
                <span className="font-black text-neutral-900">Total a pagar:</span>
                <span className="font-black text-xl text-[#00B84A]">{selectedKit.priceFormatted}</span>
              </div>
              <p className="text-[11px] text-neutral-500 text-right">
                {selectedKit.installments} • Frete Grátis
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-1/3 h-[48px] rounded-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-2/3 h-[48px] rounded-[10px] bg-[#00B84A] hover:bg-[#009e3f] active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Ir para Checkout</span>
                <Zap className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>

            {/* Fineprint */}
            <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-neutral-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00B84A]" />
              <span>Ambiente protegido • Compra 100% segura</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
