'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  QrCode,
  CreditCard,
  Barcode,
  Truck,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function CheckoutContent() {
  const searchParams = useSearchParams()

  const marca = searchParams.get('marca') || 'Volkswagen'
  const modelo = searchParams.get('modelo') || 'Nivus'
  const ano = searchParams.get('ano') || '2024'
  const kit = searchParams.get('kit') || 'Kit Completo (Cabine + Porta-Malas)'
  const textura = searchParams.get('textura') || 'Circuito / Tech'
  const cor = searchParams.get('cor') || 'Preto Carbon'
  const rawAmount = searchParams.get('amount') || '247'
  const amount = Number(rawAmount) || 247

  const pixAmount = (amount * 0.95).toFixed(2).replace('.', ',')
  const installmentAmount = (amount / 12).toFixed(2).replace('.', ',')

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix')
  const [copied, setCopied] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(
      '00020126580014br.gov.bcb.pix0136alfacarbon-shop-pix-chave-aleatoria5204000053039865802BR5920ALFACARBON AUTOMOTIVO6009SAO PAULO62070503***6304ABCD'
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isSuccess) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-[#EBF8F0] text-[#00B84A] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 mb-2">
          Pedido Gerado com Sucesso!
        </h2>
        <p className="text-sm text-neutral-600 mb-6">
          Enviamos os detalhes do pedido e o código de rastreamento para o seu WhatsApp e e-mail cadastrados.
        </p>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs space-y-2 mb-6">
          <p><strong>Veículo:</strong> {marca} {modelo} ({ano})</p>
          <p><strong>Kit:</strong> {kit}</p>
          <p><strong>Textura:</strong> {textura}</p>
          <p><strong>Cor:</strong> {cor}</p>
          <p><strong>Total:</strong> R$ {amount},00 com Frete Grátis</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 h-12 bg-[#0A0A0A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
        >
          Voltar para a Loja
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
      
      {/* ── LEFT: FORMULÁRIO DE ENTREGA E PAGAMENTO ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 01. Dados Pessoais */}
        <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-neutral-200 shadow-sm">
          <h2 className="text-base font-black text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-extrabold">
              1
            </span>
            <span>Dados para Envio e Rastreamento</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-700 mb-1">Nome Completo</label>
              <input
                required
                type="text"
                name="nome"
                placeholder="Ex: Carlos Eduardo Silva"
                value={formData.nome}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">WhatsApp / Celular</label>
              <input
                required
                type="tel"
                name="whatsapp"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">E-mail</label>
              <input
                required
                type="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 02. Endereço de Entrega */}
        <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-neutral-200 shadow-sm">
          <h2 className="text-base font-black text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-extrabold">
              2
            </span>
            <span>Endereço de Entrega (Frete Grátis)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">CEP</label>
              <input
                required
                type="text"
                name="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-700 mb-1">Rua / Avenida</label>
              <input
                required
                type="text"
                name="endereco"
                placeholder="Ex: Av. Paulista"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Número</label>
              <input
                required
                type="text"
                name="numero"
                placeholder="1000"
                value={formData.numero}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Bairro</label>
              <input
                required
                type="text"
                name="bairro"
                placeholder="Bela Vista"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Cidade / UF</label>
              <input
                required
                type="text"
                name="cidade"
                placeholder="São Paulo - SP"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 text-sm focus:border-[#00B84A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 03. Método de Pagamento */}
        <div className="bg-white p-5 sm:p-6 rounded-[14px] border border-neutral-200 shadow-sm">
          <h2 className="text-base font-black text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-extrabold">
              3
            </span>
            <span>Forma de Pagamento</span>
          </h2>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* PIX */}
            <button
              type="button"
              onClick={() => setPaymentMethod('pix')}
              className={cn(
                'p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5',
                paymentMethod === 'pix'
                  ? 'border-[#00B84A] bg-[#EBF8F0] shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <QrCode className="w-5 h-5 text-[#00B84A]" />
              <span className="text-xs font-black text-neutral-900">PIX</span>
              <span className="text-[10px] font-bold text-[#00B84A] bg-white px-1.5 py-0.5 rounded-full shadow-xs">
                5% OFF
              </span>
            </button>

            {/* Cartão */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5',
                paymentMethod === 'card'
                  ? 'border-[#00B84A] bg-[#EBF8F0] shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <CreditCard className="w-5 h-5 text-neutral-800" />
              <span className="text-xs font-black text-neutral-900">Cartão</span>
              <span className="text-[10px] font-bold text-neutral-500">Até 12x</span>
            </button>

            {/* Boleto */}
            <button
              type="button"
              onClick={() => setPaymentMethod('boleto')}
              className={cn(
                'p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5',
                paymentMethod === 'boleto'
                  ? 'border-[#00B84A] bg-[#EBF8F0] shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <Barcode className="w-5 h-5 text-neutral-800" />
              <span className="text-xs font-black text-neutral-900">Boleto</span>
              <span className="text-[10px] font-bold text-neutral-500">À vista</span>
            </button>
          </div>

          {/* Detalhe do Pagamento selecionado */}
          {paymentMethod === 'pix' && (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-neutral-900">Valor no PIX (com 5% OFF):</span>
                <span className="font-black text-sm text-[#00B84A]">R$ {pixAmount}</span>
              </div>
              <p className="text-neutral-500 mb-3">
                Aprovação imediata. O código QR e a chave Copia e Cola serão gerados ao clicar no botão abaixo.
              </p>
              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full h-10 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-800 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#00B84A]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Código Pix Copiado!' : 'Copiar Chave Pix'}</span>
              </button>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm focus:border-[#00B84A] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm focus:border-[#00B84A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm focus:border-[#00B84A] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Parcelamento</label>
                <select className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm focus:border-[#00B84A] focus:outline-none">
                  <option value="1">1x de R$ {amount},00 sem juros</option>
                  <option value="3">3x de R$ {(amount / 3).toFixed(2).replace('.', ',')} sem juros</option>
                  <option value="6">6x de R$ {(amount / 6).toFixed(2).replace('.', ',')} sem juros</option>
                  <option value="12">12x de R$ {installmentAmount} sem juros</option>
                </select>
              </div>
            </div>
          )}

          {paymentMethod === 'boleto' && (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <p className="text-neutral-600 mb-2">
                O boleto bancário pode levar de 1 a 2 dias úteis para compensar após o pagamento.
              </p>
              <p className="font-bold text-neutral-900">
                Total à vista: R$ {amount},00 com Frete Grátis
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-14 bg-[#00B84A] hover:bg-[#009e3f] active:scale-[0.99] text-white font-extrabold text-base uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 stroke-[2.5]" />
          <span>FINALIZAR PEDIDO COM SEGURANÇA</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#00B84A]" />
          <span>Criptografia SSL de 256 bits • Garantia incondicional de 30 dias</span>
        </div>

      </form>

      {/* ── RIGHT: RESUMO DO PEDIDO ── */}
      <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm sticky top-28">
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-200 mb-4">
          Resumo do Pedido
        </h3>

        {/* Product Box */}
        <div className="flex gap-4 items-center pb-4 border-b border-neutral-100">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 p-1 border border-neutral-200">
            <Image
              src="/cap-assets/prod-gallery-1.png"
              alt="Tapete 3D Sob Medida"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <span className="text-[10px] font-black text-[#00B84A] uppercase block">
              ALFACARBON 3D ORIGINAL
            </span>
            <h4 className="font-extrabold text-sm text-neutral-900 truncate">
              {marca} {modelo} ({ano})
            </h4>
            <p className="text-neutral-500 mt-0.5 truncate">{kit}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="py-4 space-y-2.5 text-xs border-b border-neutral-100">
          <div className="flex justify-between">
            <span className="text-neutral-500">Veículo:</span>
            <span className="font-bold text-neutral-900">{marca} {modelo} {ano}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Textura:</span>
            <span className="font-bold text-[#00B84A]">{textura}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Cor:</span>
            <span className="font-bold text-neutral-900">{cor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Frete Expresso:</span>
            <span className="font-bold text-[#00B84A] uppercase">Grátis</span>
          </div>
        </div>

        {/* Price Row */}
        <div className="pt-4 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-neutral-700">Subtotal:</span>
            <span className="text-sm font-bold text-neutral-400 line-through">
              {kit.includes('Completo') ? 'R$ 630,00' : 'R$ 490,00'}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-base font-black text-neutral-900">Total a pagar:</span>
            <span className="text-2xl font-black text-[#00B84A]">
              R$ {amount},00
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 text-right">
            ou 12x de R$ {installmentAmount} sem juros
          </p>
        </div>

        {/* Badges */}
        <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#00B84A] shrink-0" />
            <span>Envio com código de rastreamento no WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00B84A] shrink-0" />
            <span>Garantia total de 30 dias para testar no carro</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-neutral-900 pb-20">
      {/* Top Simple Header */}
      <header className="w-full bg-[#0A0A0A] text-white py-4 border-b border-white/10">
        <Container className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-extrabold tracking-[0.06em] text-lg text-white"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-400 mr-1" />
            <span>TAPE<span className="text-[#00B84A]">CARBON</span></span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#00B84A]" />
            <span>Checkout Seguro 100% Criptografado</span>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="pt-8 sm:pt-12">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-2">
              Finalizar seu Pedido
            </h1>
            <p className="text-sm text-neutral-500 mb-8">
              Preencha seus dados para receber o jogo sob medida diretamente na sua casa.
            </p>

            <Suspense fallback={<div className="p-8 text-center text-neutral-500">Carregando dados do veículo...</div>}>
              <CheckoutContent />
            </Suspense>
          </div>
        </Container>
      </main>
    </div>
  )
}
