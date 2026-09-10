'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CartItem } from '@/hooks/useCart'

interface CartDrawerProps {
  isOpen: boolean
  items: CartItem[]
  subtotal: number
  onClose: () => void
  onRemoveItem: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function CartDrawer({
  isOpen,
  items,
  subtotal,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[400] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[500] w-full max-w-[420px] bg-white text-neutral-900 flex flex-col shadow-2xl',
          'transition-transform duration-[380ms] ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 flex-shrink-0 bg-[#fafafa]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-700 stroke-[2]" />
            <span className="font-extrabold text-[16px] text-neutral-900">
              Seu Carrinho
            </span>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-[#00B84A]/10 text-[#00B84A] text-[12px] font-bold rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/50 transition cursor-pointer"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-[#f4fff8] border-b border-[#00B84A]/20 px-6 py-2.5 text-xs text-[#00B84A] font-bold flex items-center gap-2">
          <span>📦</span>
          <span>Parabéns! Você ganhou <strong>FRETE GRÁTIS</strong> neste pedido.</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-neutral-300" />
              </div>
              <p className="font-extrabold text-neutral-800 text-base mb-1">
                Seu carrinho está vazio
              </p>
              <p className="text-xs text-neutral-500 max-w-xs mb-6 font-medium">
                Selecione a marca, modelo e ano do seu veículo para configurar seu jogo sob medida.
              </p>
              <button
                onClick={() => {
                  onClose()
                  const el = document.getElementById('produto-compra')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 rounded-[8px] bg-[#00B84A] hover:bg-[#009e3f] text-white text-xs font-bold uppercase tracking-wide transition cursor-pointer"
              >
                Configurar meu carro
              </button>
            </div>
          ) : (
            <ul className="space-y-4" role="list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa] flex gap-4"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src="/cap-assets/kit-completo.png"
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[13px] text-neutral-900 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {item.brand} {item.model} · {item.year}
                    </p>
                    <p className="text-[11px] text-[#00B84A] font-bold mt-0.5">
                      {item.kit}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-[6px] p-0.5">
                        <button
                          className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-neutral-900">
                          {item.price
                            ? `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
                            : 'R$ 197,00'}
                        </span>
                        <button
                          className="text-neutral-300 hover:text-red-500 transition cursor-pointer"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Remover item"
                        >
                          <X className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-[#fafafa] flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-neutral-500">Subtotal</span>
              <span className="text-xl font-black text-neutral-900">
                {subtotal > 0
                  ? `R$ ${subtotal.toFixed(2).replace('.', ',')}`
                  : 'R$ 197,00'}
              </span>
            </div>

            <button
              onClick={() => {
                alert('Redirecionando para o checkout 100% seguro...')
              }}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[8px] bg-[#00B84A] hover:bg-[#009e3f] text-white text-sm font-bold uppercase tracking-wider transition shadow cursor-pointer"
            >
              Finalizar Pedido
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00B84A]" />
              <span>Checkout 100% criptografado e seguro</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
