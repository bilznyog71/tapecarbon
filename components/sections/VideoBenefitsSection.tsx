'use client';

import React from 'react';

const BENEFITS = [
  {
    video: '/media/cobertura.mp4',
    title: 'Cobertura total',
    desc: 'Protege o assoalho inteiro, sem áreas expostas para reter poeira e líquidos.'
  },
  {
    video: '/media/encaixe-sob-medida.mp4',
    title: 'Encaixe sob medida',
    desc: 'Ajuste perfeito para não escorregar e não atrapalhar o acionamento dos pedais.'
  },
  {
    video: '/media/limpeza.mp4',
    title: 'Fácil de limpar',
    desc: 'Resistente a água e sujeira. Limpeza rápida no dia a dia com pano úmido ou água.'
  }
];

export default function VideoBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#0d0f13] border-t border-b border-white/5" id="beneficios">
      <div className="wrap max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-block mb-3">
            Diferenciais em Vídeo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Por que escolher os tapetes <span className="text-red-500">BANDEJA 3D?</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Veja a proteção na prática. Acabamento sob medida que valoriza seu veículo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {BENEFITS.map((b, i) => (
            <article
              key={i}
              className="bg-[#171a21] border border-white/10 rounded-2xl overflow-hidden p-4 shadow-xl flex flex-col hover:border-white/20 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/60 mb-4 border border-white/5">
                <video
                  src={b.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{b.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
