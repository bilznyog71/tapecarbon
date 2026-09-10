'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOCK_BRANDS,
  getModelsByBrand,
  getYearsByModel,
  type VehicleBrand,
  type VehicleModel,
} from '@/data/vehicles'


// ── Custom Select Component ─────────────────────────────────
interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  id: string
  label: string
  placeholder: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  isComplete?: boolean
}

function CustomSelect({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  isComplete = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // Filter options based on search
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Focus search input when opening
  useEffect(() => {
    if (open && options.length > 5) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open, options.length])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
    setSearchTerm('')
    buttonRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <label
        htmlFor={id}
        className="block text-[11px] font-inter font-semibold tracking-[0.12em] text-white/40 uppercase mb-2 pl-0.5"
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Selecionar ${label}`}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'relative w-full flex items-center justify-between gap-2 px-4 py-3.5',
          'border rounded-lg text-left',
          'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'font-inter text-[13px]',
          disabled
            ? 'border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed'
            : open
            ? 'border-accent/80 bg-graphite text-white shadow-[0_0_16px_rgba(140,198,63,0.2)] ring-1 ring-accent/40'
            : isComplete
            ? 'border-accent/50 bg-graphite/80 text-white'
            : 'border-white/15 bg-graphite/80 text-white/90 hover:border-white/30 hover:bg-graphite hover:text-white'
        )}
      >
        <span className={cn('truncate font-medium', !selectedOption && 'text-white/35 font-normal')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          {isComplete && !open && (
            <Check size={13} strokeWidth={2.5} className="text-accent" />
          )}
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={cn(
              'text-white/40 transition-transform duration-200',
              open && 'rotate-180 text-accent',
              isComplete && !open && 'text-accent/70'
            )}
          />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-[#1a1a1a] border border-white/15 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Quick search input if more than 5 options */}
          {options.length > 5 && (
            <div className="p-2 border-b border-white/8 bg-black/30">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar ${label.toLowerCase()}...`}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[12px] font-inter text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
              />
            </div>
          )}

          <ul
            ref={listRef}
            role="listbox"
            aria-label={`Opções para ${label}`}
            className="overflow-y-auto divide-y divide-white/[0.04]"
            style={{ maxHeight: '220px' }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    'flex items-center justify-between px-4 py-2.5 text-[13px] font-inter cursor-pointer transition-colors duration-150',
                    option.value === value
                      ? 'bg-accent/15 text-accent font-semibold'
                      : 'text-white/75 hover:bg-white/[0.08] hover:text-white'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check size={13} strokeWidth={2.5} className="text-accent flex-shrink-0" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-[12px] text-white/30 text-center font-inter">
                Nenhum resultado encontrado
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── VehicleFinder Main Component ───────────────────────────
export default function VehicleFinder() {
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null)
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)



  const brandOptions: SelectOption[] = MOCK_BRANDS.map((b) => ({
    value: b.id,
    label: b.name,
  }))

  const modelOptions: SelectOption[] = selectedBrand
    ? getModelsByBrand(selectedBrand.id).map((m) => ({
        value: m.id,
        label: m.name,
      }))
    : []

  const yearOptions: SelectOption[] = selectedModel
    ? getYearsByModel(selectedModel.id).map((y) => ({
        value: String(y),
        label: String(y),
      }))
    : []

  const isComplete = !!selectedBrand && !!selectedModel && !!selectedYear

  const handleBrandChange = useCallback(
    (value: string) => {
      const brand = MOCK_BRANDS.find((b) => b.id === value) || null
      setSelectedBrand(brand)
      setSelectedModel(null)
      setSelectedYear(null)
      setSubmitted(false)
    },
    []
  )

  const handleModelChange = useCallback(
    (value: string) => {
      if (!selectedBrand) return
      const models = getModelsByBrand(selectedBrand.id)
      const model = models.find((m) => m.id === value) || null
      setSelectedModel(model)
      setSelectedYear(null)
      setSubmitted(false)
    },
    [selectedBrand]
  )

  const handleYearChange = useCallback((value: string) => {
    setSelectedYear(Number(value))
    setSubmitted(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete) return
    setSubmitted(true)
    // TODO: Integrate with product catalog API
    // Navigate to product page or scroll to product section
    const productSection = document.getElementById('produto')
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="vehicle-finder"
      className="relative bg-black section-py overflow-hidden border-t border-white/[0.06]"
      aria-label="Encontrar tapete para seu veículo"
    >
      {/* Dramatic background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/[0.06] rounded-full blur-[130px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      <div className="container-site relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/[0.08] border border-accent/20 mb-5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-inter font-bold tracking-[0.14em] uppercase text-accent">
              CATÁLOGO DIGITAL 1:1
            </span>
          </div>
          <h2 className="font-manrope font-extrabold text-[36px] sm:text-[44px] md:text-[52px] text-white tracking-tight leading-[1.1] mb-4">
            Qual é o seu carro?
          </h2>
          <p className="text-white/50 text-[16px] sm:text-[18px] font-inter max-w-[560px] mx-auto leading-[1.65]">
            Selecione marca, modelo e ano para localizar o molde milimétrico exato para o assoalho do seu veículo.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto p-8 sm:p-10 md:p-12 rounded-3xl bg-[#0d0d0d] border border-white/[0.1] shadow-[0_30px_80px_rgba(0,0,0,0.9)]">

          <form onSubmit={handleSubmit} noValidate className="w-full">
            {/* Selects Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <CustomSelect
                id="vehicle-brand"
                label="Marca"
                placeholder="Selecionar marca"
                options={brandOptions}
                value={selectedBrand?.id || ''}
                onChange={handleBrandChange}
                isComplete={!!selectedBrand}
              />

              <CustomSelect
                id="vehicle-model"
                label="Modelo"
                placeholder={selectedBrand ? 'Selecionar modelo' : 'Selecione a marca'}
                options={modelOptions}
                value={selectedModel?.id || ''}
                onChange={handleModelChange}
                disabled={!selectedBrand}
                isComplete={!!selectedModel}
              />

              <CustomSelect
                id="vehicle-year"
                label="Ano"
                placeholder={selectedModel ? 'Selecionar ano' : 'Selecione o modelo'}
                options={yearOptions}
                value={selectedYear ? String(selectedYear) : ''}
                onChange={handleYearChange}
                disabled={!selectedModel}
                isComplete={!!selectedYear}
              />
            </div>

            {/* Selected Vehicle Preview */}
            {isComplete && !submitted && (
              <div className="flex items-center gap-2.5 px-4 py-3 mb-4 rounded-lg border border-accent/25 bg-accent/5">
                <Check size={14} strokeWidth={2.5} className="text-accent flex-shrink-0" />
                <p className="text-[13px] font-inter text-white/70">
                  <span className="text-white font-medium">
                    {selectedBrand?.name} {selectedModel?.name} {selectedYear}
                  </span>
                  {' '}— tapete compatível encontrado
                </p>
              </div>
            )}

            {/* Success State */}
            {submitted && (
              <div className="flex items-center gap-2.5 px-4 py-3 mb-4 rounded-lg border border-accent/40 bg-accent/8">
                <Check size={14} strokeWidth={2.5} className="text-accent flex-shrink-0" />
                <p className="text-[13px] font-inter text-accent">
                  Molde 3D 1:1 confirmado para seu {selectedBrand?.name} {selectedModel?.name} {selectedYear}
                </p>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={!isComplete}
              aria-disabled={!isComplete}
              className={cn(
                'w-full h-14 min-h-[56px] flex items-center justify-center gap-2.5 px-6 rounded-xl',
                'font-inter font-extrabold text-[14px] tracking-wider uppercase',
                'transition-all duration-200',
                isComplete
                  ? 'bg-accent text-black hover:bg-[#a8e050] hover:shadow-[0_0_30px_rgba(140,198,63,0.4)] active:scale-[0.99] cursor-pointer'
                  : 'bg-white/[0.04] text-white/35 border border-white/[0.1] cursor-not-allowed'
              )}
            >
              {isComplete ? (
                <>
                  Ver tapete para meu carro
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              ) : (
                'Selecione marca, modelo e ano'
              )}
            </button>

            <p className="text-center text-[12px] text-white/20 font-inter mt-4">
              * Dados de demonstração — catálogo completo em breve
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
