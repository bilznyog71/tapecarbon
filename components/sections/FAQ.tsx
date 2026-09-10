'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ_ITEMS = [
  {
    q: 'O tapete é realmente sob medida para meu veículo?',
    a: 'Sim. Selecione o veículo no painel (marca, modelo e ano) e o kit apresentado corresponde exatamente ao molde e encaixe do seu carro ou picape, cobrindo todo o assoalho sem sobras.',
  },
  {
    q: 'Ele não escorrega? Como fica preso?',
    a: 'O design tipo bandeja conta com base antiderrapante emborrachada e sistema de fixação compatível com as travas originais do veículo. Além disso, o formato sob medida evita folgas ou sobras que geram movimentação.',
  },
  {
    q: 'Como faço para limpar?',
    a: 'É bem simples: retire o tapete, sacuda a sujeira e passe um pano úmido ou lave com água corrente e sabão neutro. O material em TPE seca super rápido e não retém odores.',
  },
  {
    q: 'O tapete segura água, barro e areia mesmo?',
    a: 'Sim. As bordas elevadas de contenção e os canais profundos ajudam a conter até litros de líquidos, lama, terra e areia, blindando o carpete original contra umidade e manchas.',
  },
  {
    q: 'É seguro comprar? Vou receber direitinho?',
    a: 'Todas as encomendas são despachadas com seguro contra extravio e código de rastreamento enviado automaticamente para seu WhatsApp e e-mail. Você acompanha cada etapa da entrega e conta com suporte dedicado.',
  },
  {
    q: 'Em quanto tempo chega?',
    a: 'O prazo varia por região do Brasil (geralmente entre 3 e 7 dias úteis). O frete é 100% gratuito com envio expresso prioritário.',
  },
  {
    q: 'Posso devolver se não gostar? Qual é a garantia?',
    a: 'Sim. Você tem 30 dias para testar no seu carro com garantia incondicional de satisfação. Se não gostar por qualquer motivo, devolvemos 100% do valor pago — sem perguntas e sem burocracia.',
  },
  {
    q: 'E se não assentar bem no meu carro?',
    a: 'Produzimos com molde digital específico do seu veículo (marca + modelo + ano). No raro caso de qualquer incompatibilidade, trocamos imediatamente sem custo OU devolvemos o valor integral.',
  },
  {
    q: 'E se eu selecionar o modelo errado sem querer?',
    a: 'Sem estresse: antes do envio, você confere o resumo da encomenda e nossa equipe técnica confirma os dados do seu veículo pelo WhatsApp para assegurar que o molde seja perfeito.',
  },
  {
    q: 'Posso escolher cor e textura?',
    a: 'Sim. Você seleciona o acabamento e a textura desejada (Circuito / Tech, Fluxo / Ondas ou Pedra / Off-Road) diretamente no configurador — e o resumo final mostra tudo certinho antes de confirmar o pedido.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx))
  }

  return (
    <section id="faq" className="bg-white py-14 sm:py-20 lg:py-24 text-neutral-900 overflow-hidden">
      <Container>
        <div className="w-full max-w-[900px] mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-neutral-900 tracking-tight leading-[1.15]">
              Perguntas Frequentes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
              Tudo o que você precisa saber antes de finalizar o seu pedido.
            </p>
          </div>

          {/* Clean Accordion List — NobreCar Style */}
          <div className="w-full">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx
              return (
                <div
                  key={idx}
                  className="border-b border-[#E7E7E7] py-4 sm:py-5"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full text-left font-semibold text-neutral-900 text-[15px] sm:text-[16px] leading-[1.4] flex justify-between items-center gap-4 sm:gap-6 cursor-pointer group"
                  >
                    <span className="group-hover:text-[#00B84A] transition-colors">
                      {item.q}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#EBF8F0] text-[#00B84A] flex items-center justify-center shrink-0 group-hover:bg-[#00B84A] group-hover:text-white transition-colors duration-200">
                      <Plus
                        className={cn(
                          'w-4 h-4 transition-transform duration-300 stroke-[2.5]',
                          isOpen && 'rotate-45'
                        )}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-2 max-w-[760px] text-[14px] sm:text-[15px] text-neutral-600 leading-[1.65] font-normal">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </Container>
    </section>
  )
}
