'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { useIntersection } from '@/hooks/useIntersection'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    step: '01',
    title: 'Posicionamento Intuitivo',
    description: 'Basta colocar a peça sobre o assoalho. O contorno milimétrico 1:1 assenta naturalmente.',
  },
  {
    step: '02',
    title: 'Fixação de Fábrica',
    description: 'Pressione os pontos de encaixe nos pinos originais do carro. Trava com firmeza absoluta.',
  },
  {
    step: '03',
    title: 'Proteção Ativa 3D',
    description: 'Bordas de contenção laterais prontas para reter lama, areia, líquidos e poeira.',
  },
]

export default function VideoExperience() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  const { ref: sectionRef, isVisible } = useIntersection<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="relative bg-black section-py overflow-hidden border-t border-white/5"
      aria-label="Ver o TAPECARBON em uso"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left Editorial Column (col-span-6) ── */}
          <div
            className={cn(
              'lg:col-span-6 transition-all duration-700',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles size={13} className="text-accent" />
              <span className="text-[11px] font-inter font-bold tracking-wider uppercase text-accent">
                DEMONSTRAÇÃO PRÁTICA
              </span>
            </div>

            <h2 className="font-manrope font-extrabold text-[28px] sm:text-[36px] md:text-[44px] text-white leading-[1.15] tracking-tight mb-6">
              Instalação em segundos.{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">
                Sem ferramentas.
              </span>
            </h2>

            <p className="text-[14.5px] sm:text-[15.5px] text-white/60 font-inter leading-[1.7] max-w-xl mb-8">
              Retire, lave com água e sabão e reinstale com total simplicidade. O molde 3D segue
              cada curva e relevo do assoalho original, garantindo estabilidade máxima sem se mover
              sob os pedais.
            </p>

            {/* Interactive Steps */}
            <div className="space-y-3 mb-8">
              {STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    'w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200',
                    activeStep === idx
                      ? 'bg-carbon border-accent/40 shadow-[0_0_15px_rgba(140,198,63,0.1)]'
                      : 'bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                  )}
                >
                  <span
                    className={cn(
                      'text-[12px] font-inter font-extrabold px-2.5 py-1 rounded-md border transition-colors',
                      activeStep === idx
                        ? 'bg-accent text-black border-accent'
                        : 'bg-white/5 text-white/40 border-white/10'
                    )}
                  >
                    {s.step}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        'font-manrope font-bold text-[14px] sm:text-[15px] mb-0.5',
                        activeStep === idx ? 'text-white' : 'text-white/70'
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[12.5px] text-white/40 font-inter leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                <span className="text-[12.5px] font-inter">Não desliza nos pedais</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                <span className="text-[12.5px] font-inter">Secagem ultrarrápida</span>
              </div>
            </div>
          </div>

          {/* ── Right Video/Showcase Reel (col-span-6) ── */}
          <div
            className={cn(
              'lg:col-span-6 transition-all duration-700',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-carbon shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[16/10] sm:aspect-[16/10] group">
              {/* Main Visual Frame */}
              <Image
                src="/images/product-installed.webp"
                alt="Demonstração do tapete TAPECARBON 3D instalado no veículo"
                fill
                priority
                className={cn(
                  'object-cover object-center transition-transform duration-700 ease-out',
                  isPlaying ? 'scale-105' : 'scale-100'
                )}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Cinema vignette overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(9,9,9,0.85) 0%, rgba(9,9,9,0.2) 50%, rgba(9,9,9,0.5) 100%)',
                }}
              />

              {/* Video Player Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-inter font-semibold text-white tracking-wider uppercase">
                    SHOWCASE 4K
                  </span>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              {/* Central Play/Pause Trigger */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/90 hover:bg-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(140,198,63,0.5)] hover:scale-110 active:scale-95 transition-all duration-200"
                  aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                >
                  {isPlaying ? (
                    <Pause size={24} fill="currentColor" stroke="none" />
                  ) : (
                    <Play size={24} fill="currentColor" stroke="none" className="ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Video Progress Bar & Info */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-inter text-white/60 mb-2">
                    <span className="font-semibold text-white">TAPECARBON 3D — Demonstração em Uso</span>
                    <span>0:32 / 0:45</span>
                  </div>

                  {/* Animated simulated scrubber */}
                  <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className={cn(
                        'h-full bg-accent transition-all duration-1000',
                        isPlaying ? 'w-3/4' : 'w-1/2'
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
