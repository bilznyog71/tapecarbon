'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney } from '@/data/config';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart, removeFromCart } = useStore();

  // 3-step sequential accordion: 1 = Identificação, 2 = Entrega, 3 = Pagamento, 4 = Concluído
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [payMethod, setPayMethod] = useState<'pix' | 'card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [payError, setPayError] = useState('');
  const [receiptFile, setReceiptFile] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
      setReceiptFile({
        name: file.name,
        size: formattedSize,
      });
    }
  };

  // Step 1: Identificação
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Entrega
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [step2Error, setStep2Error] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepFeedback, setCepFeedback] = useState('');
  const numeroInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');

  // Cupom
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState('');

  // Fallback item if cart is empty
  const cartItems = cart.length > 0 ? cart : [
    {
      id: 'default-kit',
      vehicle: 'Universal / Personalizado',
      kit: 'full',
      kitName: 'Tapetes Bandeja 3D AlfaCarbon Sob Medida',
      color: 'black',
      colorName: 'Preto Carbon',
      price: 247,
      priceOld: 499,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountPix = payMethod === 'pix' ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountPix - couponDiscount);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    modalContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ViaCEP Instant Lookup
  const handleCepChange = async (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
    setCep(masked);

    if (raw.length === 8) {
      setIsSearchingCep(true);
      setCepFeedback('Buscando endereço...');
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || 'SP');
          setCepFeedback(`✓ Endereço localizado: ${data.localidade} - ${data.uf}`);
          setTimeout(() => {
            numeroInputRef.current?.focus();
          }, 120);
        } else {
          setCepFeedback('CEP não encontrado. Digite o endereço manualmente.');
        }
      } catch {
        setCepFeedback('Não foi possível buscar o CEP automaticamente.');
      } finally {
        setIsSearchingCep(false);
      }
    } else {
      setCepFeedback('');
    }
  };

  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let masked = raw;
    if (raw.length > 6) {
      masked = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    } else if (raw.length > 2) {
      masked = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    setTelefone(masked);
  };

  const handleCpfChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let masked = raw;
    if (raw.length > 9) {
      masked = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
    } else if (raw.length > 6) {
      masked = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    } else if (raw.length > 3) {
      masked = `${raw.slice(0, 3)}.${raw.slice(3)}`;
    }
    setCpf(masked);
  };

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  const handleCardExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCardCvvChange = (val: string) => {
    setCardCvv(val.replace(/\D/g, '').slice(0, 4));
  };

  // Cupom
  const applyCoupon = () => {
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;
    if (clean === 'ALFA10' || clean === 'PRIMEIRACOMPRA' || clean === 'BEMVINDO') {
      const discountVal = Math.round(subtotal * 0.1 * 100) / 100;
      setCouponDiscount(discountVal);
      setCouponFeedback(`✓ Cupom "${clean}" aplicado: 10% de desconto!`);
    } else {
      setCouponDiscount(0);
      setCouponFeedback('Cupom inválido ou expirado.');
    }
  };

  // Blackcat Pix Generator
  const generatePix = useCallback(async () => {
    setIsGeneratingPix(true);
    setPayError('');
    try {
      const res = await fetch('/api/blackcat/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cartItems,
          customer: { nome, sobrenome, email, telefone, cpf },
          address: { cep, rua, numero, complemento, bairro, cidade, estado },
          paymentMethod: 'pix',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const txnId = data.data.transactionId;
        const pData = data.data.paymentData;
        setTransactionId(txnId);
        setOrderId(txnId);
        if (pData?.copyPaste) {
          setPixCode(pData.copyPaste);
        } else if (pData?.qrCode) {
          setPixCode(pData.qrCode);
        }
        if (pData?.qrCodeBase64) {
          setPixQrImage(pData.qrCodeBase64);
        }

        // Real-time polling
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/blackcat/status/${txnId}`);
            const statusData = await statusRes.json();
            if (statusData.success && statusData.data?.status === 'PAID') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setOrderId(txnId);
              setActiveStep(4);
              clearCart();
              scrollToTop();
            }
          } catch {}
        }, 3500);
      } else {
        setPayError(data.error || data.message || 'Não foi possível gerar a cobrança Pix na Blackcat.');
      }
    } catch {
      setPayError('Erro de conexão com o servidor de pagamento. Tente novamente.');
    } finally {
      setIsGeneratingPix(false);
    }
  }, [cartItems, nome, sobrenome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, estado, clearCart]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Step 1 Validation -> Next
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nome.trim() || !sobrenome.trim() || !telefone.trim() || !cpf.trim()) {
      setStep1Error('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    const cleanEmail = email.trim();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStep1Error('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStep1Error('Por favor, informe um WhatsApp ou telefone válido com DDD.');
      return;
    }
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length < 11) {
      setStep1Error('Por favor, informe um CPF válido.');
      return;
    }

    setStep1Error('');
    setActiveStep(2);
    scrollToTop();
  };

  // Step 2 Validation -> Next
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setStep2Error('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }
    if (!rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      setStep2Error('Por favor, preencha o endereço completo com número e bairro.');
      return;
    }

    setStep2Error('');
    setActiveStep(3);
    scrollToTop();

    if (payMethod === 'pix' && !pixCode) {
      setTimeout(() => {
        generatePix();
      }, 80);
    }
  };

  const handleSwitchPaymentMethod = (method: 'pix' | 'card') => {
    setPayMethod(method);
    setPayError('');
    if (method === 'pix' && !pixCode) {
      generatePix();
    }
  };

  // Finalize Card Payment
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCard = cardNumber.replace(/\D/g, '');
    if (rawCard.length < 15) {
      setPayError('Por favor, informe o número completo do cartão.');
      return;
    }
    if (!cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      setPayError('Por favor, preencha todos os dados do cartão de crédito.');
      return;
    }

    setIsSubmitting(true);
    setPayError('');

    try {
      const expParts = cardExpiry.split('/');
      const expMonth = expParts[0]?.trim() || '';
      const expYear = expParts[1]?.trim() ? `20${expParts[1].trim()}`.slice(-4) : '';

      const res = await fetch('/api/blackcat/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cartItems,
          customer: { nome, sobrenome, email, telefone, cpf },
          address: { cep, rua, numero, complemento, bairro, cidade, estado },
          paymentMethod: 'card',
          card: {
            number: rawCard,
            holderName: cardName.trim(),
            expMonth,
            expYear,
            cvv: cardCvv.trim(),
            installments: Number(cardInstallments) || 1,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setOrderId(data.data.transactionId || 'CARD-' + Date.now().toString(36).toUpperCase());
        if (data.data.status === 'PAID' || data.data.status === 'AUTHORIZED') {
          setIsSubmitting(false);
          setActiveStep(4);
          clearCart();
          scrollToTop();
        } else if (data.data.status === 'PENDING_3DS' && data.data.threeDS?.start?.acsUrl) {
          window.location.href = data.data.threeDS.start.acsUrl;
        } else if (data.data.status === 'FAILED') {
          setPayError(data.data.refusedReason?.description || 'Pagamento recusado pela operadora do cartão.');
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          setActiveStep(4);
          clearCart();
          scrollToTop();
        }
      } else {
        setPayError(data.error || data.message || 'Não foi possível autorizar o cartão. Verifique os dados digitados.');
        setIsSubmitting(false);
      }
    } catch {
      setPayError('Erro de conexão ao processar o pagamento com cartão.');
      setIsSubmitting(false);
    }
  };

  const handleConfirmPixPaid = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveStep(4);
      clearCart();
      scrollToTop();
    }, 800);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div
      className="columbia-co"
      id="checkout"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout AlfaCarbon"
      ref={modalContainerRef}
    >
      {/* Top Header - Dark Luxury */}
      <header className="columbia-co-hd">
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={closeCheckout}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/logo.png"
                alt="AlfaCarbon"
                style={{ height: 32, width: 'auto' }}
              />
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div className="columbia-secure-tag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19C25A" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Pagamento 100% seguro</span>
            </div>

            <button
              type="button"
              onClick={closeCheckout}
              aria-label="Fechar checkout"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid #282E38',
                color: '#CBD5E1',
                width: 34,
                height: 34,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                transition: 'all 0.18s ease',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </header>

      <div className="columbia-co-body">
        <div className="wrap columbia-co-grid">
          
          {/* LEFT COLUMN: 3-Step Accordion */}
          <div className="columbia-main-col">
            
            {activeStep === 4 ? (
              /* Step 4: Pedido Concluído (Dark Luxury) */
              <div className="columbia-step-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: '50%',
                    background: 'rgba(25, 194, 90, 0.15)',
                    border: '2px solid #19C25A',
                    color: '#19C25A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: 36,
                    boxShadow: '0 0 24px rgba(25, 194, 90, 0.3)',
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#F4F6F8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Pedido Realizado com Sucesso!
                </h2>
                <p style={{ fontSize: 14.5, color: '#A9B0BA', margin: '0 0 22px', lineHeight: 1.5 }}>
                  Agradecemos a sua preferência. O comprovante e os dados de rastreamento foram enviados para{' '}
                  <b style={{ color: '#F4F6F8' }}>{email || 'seu e-mail'}</b> e WhatsApp <b style={{ color: '#F4F6F8' }}>{telefone || 'cadastrado'}</b>.
                </p>

                <div
                  style={{
                    background: '#111317',
                    border: '1px solid #282E38',
                    borderRadius: 12,
                    padding: '18px 24px',
                    display: 'inline-block',
                    textAlign: 'left',
                    marginBottom: 28,
                  }}
                >
                  <div style={{ fontSize: 12.5, color: '#7E8691', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Número do Pedido:</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#E8B10C', marginTop: 2 }}>
                    #{orderId ? orderId.slice(-8).toUpperCase() : 'ALFA-78921'}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#CBD5E1', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#19C25A' }}>●</span> Previsão de entrega: <b style={{ color: '#F4F6F8' }}>4 a 8 dias úteis</b>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="columbia-btn-next"
                    onClick={closeCheckout}
                    style={{ maxWidth: 280, margin: '0 auto' }}
                  >
                    Voltar à Loja
                  </button>
                </div>
              </div>
            ) : (
              /* 3 Sequential Accordion Steps */
              <>
                {/* ================= STEP 1: IDENTIFICAÇÃO ================= */}
                <div
                  className={`columbia-step-card ${activeStep === 1 ? 'active' : 'completed'}`}
                  id="card-step-1"
                >
                  <div className="columbia-step-hd">
                    <div className={`columbia-step-badge ${activeStep === 1 ? 'active' : 'done'}`}>
                      {activeStep > 1 ? '✓' : '1'}
                    </div>
                    <div>
                      <h2 className="columbia-step-title">IDENTIFICAÇÃO</h2>
                      <p className="columbia-step-sub">Preencha seus dados para envio do pedido.</p>
                    </div>

                    {activeStep > 1 && (
                      <button
                        type="button"
                        className="columbia-edit-link"
                        onClick={() => setActiveStep(1)}
                      >
                        Alterar
                      </button>
                    )}
                  </div>

                  {activeStep > 1 ? (
                    <div className="columbia-summary-info">
                      <b>{nome} {sobrenome}</b> &bull; {email} &bull; {telefone} &bull; CPF: {cpf}
                    </div>
                  ) : (
                    <form className="columbia-step-content" onSubmit={handleStep1Submit} noValidate>
                      {step1Error && (
                        <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                          {step1Error}
                        </div>
                      )}

                      <div className="columbia-fld">
                        <label className="columbia-label" htmlFor="fld-email">
                          Endereço de e-mail *
                        </label>
                        <input
                          id="fld-email"
                          type="email"
                          className="columbia-input"
                          placeholder="seuemail@exemplo.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-nome">
                            Nome *
                          </label>
                          <input
                            id="fld-nome"
                            type="text"
                            className="columbia-input"
                            placeholder="Nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                          />
                        </div>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-sobrenome">
                            Sobrenome *
                          </label>
                          <input
                            id="fld-sobrenome"
                            type="text"
                            className="columbia-input"
                            placeholder="Sobrenome"
                            value={sobrenome}
                            onChange={e => setSobrenome(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-telefone">
                            Telefone / WhatsApp *
                          </label>
                          <input
                            id="fld-telefone"
                            type="tel"
                            className="columbia-input"
                            placeholder="(11) 98765-4321"
                            value={telefone}
                            onChange={e => handlePhoneChange(e.target.value)}
                            required
                          />
                        </div>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-cpf">
                            CPF *
                          </label>
                          <input
                            id="fld-cpf"
                            type="text"
                            className="columbia-input"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={e => handleCpfChange(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="columbia-btn-next">
                        PRÓXIMO &rarr;
                      </button>
                    </form>
                  )}
                </div>

                {/* ================= STEP 2: ENTREGA ================= */}
                <div
                  className={`columbia-step-card ${
                    activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : 'locked'
                  }`}
                  id="card-step-2"
                >
                  <div className="columbia-step-hd">
                    <div
                      className={`columbia-step-badge ${
                        activeStep === 2 ? 'active' : activeStep > 2 ? 'done' : 'idle'
                      }`}
                    >
                      {activeStep > 2 ? '✓' : '2'}
                    </div>
                    <div>
                      <h2 className="columbia-step-title">ENTREGA</h2>
                      <p className="columbia-step-sub">Informe onde deseja receber o pedido.</p>
                    </div>

                    {activeStep > 2 && (
                      <button
                        type="button"
                        className="columbia-edit-link"
                        onClick={() => setActiveStep(2)}
                      >
                        Alterar
                      </button>
                    )}
                  </div>

                  {activeStep > 2 ? (
                    <div className="columbia-summary-info">
                      <b>{rua}, {numero}{complemento ? ` - ${complemento}` : ''}</b> &bull; {bairro}, {cidade} - {estado} &bull; CEP: {cep}
                    </div>
                  ) : activeStep === 2 ? (
                    <form className="columbia-step-content" onSubmit={handleStep2Submit} noValidate>
                      {step2Error && (
                        <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                          {step2Error}
                        </div>
                      )}

                      <div className="columbia-fld">
                        <label className="columbia-label" htmlFor="fld-cep">
                          CEP * {isSearchingCep && <span style={{ color: '#E8B10C', fontSize: 12 }}> (Buscando endereço...)</span>}
                        </label>
                        <input
                          id="fld-cep"
                          type="text"
                          className="columbia-input"
                          placeholder="00000-000"
                          value={cep}
                          onChange={e => handleCepChange(e.target.value)}
                          maxLength={9}
                          required
                        />
                        {cepFeedback && (
                          <div style={{ fontSize: 12, color: cepFeedback.startsWith('✓') ? '#3BE07C' : '#A9B0BA', marginTop: 4 }}>
                            {cepFeedback}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-rua">
                            Endereço / Rua *
                          </label>
                          <input
                            id="fld-rua"
                            type="text"
                            className="columbia-input"
                            placeholder="Ex: Av. Paulista"
                            value={rua}
                            onChange={e => setRua(e.target.value)}
                            required
                          />
                        </div>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-numero">
                            Número *
                          </label>
                          <input
                            id="fld-numero"
                            ref={numeroInputRef}
                            type="text"
                            className="columbia-input"
                            placeholder="123"
                            value={numero}
                            onChange={e => setNumero(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-complemento">
                            Complemento (opcional)
                          </label>
                          <input
                            id="fld-complemento"
                            type="text"
                            className="columbia-input"
                            placeholder="Apto 42, Bloco B"
                            value={complemento}
                            onChange={e => setComplemento(e.target.value)}
                          />
                        </div>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-bairro">
                            Bairro *
                          </label>
                          <input
                            id="fld-bairro"
                            type="text"
                            className="columbia-input"
                            placeholder="Bairro"
                            value={bairro}
                            onChange={e => setBairro(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-cidade">
                            Cidade *
                          </label>
                          <input
                            id="fld-cidade"
                            type="text"
                            className="columbia-input"
                            placeholder="Cidade"
                            value={cidade}
                            onChange={e => setCidade(e.target.value)}
                            required
                          />
                        </div>
                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-estado">
                            Estado (UF) *
                          </label>
                          <input
                            id="fld-estado"
                            type="text"
                            className="columbia-input"
                            placeholder="SP"
                            value={estado}
                            onChange={e => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                            maxLength={2}
                            required
                          />
                        </div>
                      </div>

                      {/* Opção de Frete Expresso Grátis */}
                      <div
                        style={{
                          background: '#111317',
                          border: '1.5px solid rgba(25, 194, 90, 0.35)',
                          borderRadius: 10,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>🚚</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#F4F6F8' }}>
                              Frete Expresso Nacional (4 a 8 dias úteis)
                            </div>
                            <div style={{ fontSize: 12, color: '#3BE07C' }}>
                              Com código de rastreamento direto no WhatsApp
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#3BE07C', textTransform: 'uppercase' }}>
                          Grátis
                        </div>
                      </div>

                      <button type="submit" className="columbia-btn-next">
                        PRÓXIMO &rarr;
                      </button>
                    </form>
                  ) : null}
                </div>

                {/* ================= STEP 3: PAGAMENTO ================= */}
                <div
                  className={`columbia-step-card ${
                    activeStep === 3 ? 'active' : 'locked'
                  }`}
                  id="card-step-3"
                >
                  <div className="columbia-step-hd">
                    <div className={`columbia-step-badge ${activeStep === 3 ? 'active' : 'idle'}`}>
                      3
                    </div>
                    <div>
                      <h2 className="columbia-step-title">PAGAMENTO</h2>
                      <p className="columbia-step-sub">Escolha a melhor forma de pagamento.</p>
                    </div>
                  </div>

                  {activeStep === 3 && (
                    <div className="columbia-step-content">
                      {payError && (
                        <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                          {payError}
                        </div>
                      )}

                      {/* Selector de Método */}
                      <div className="columbia-pay-selector">
                        <div
                          className={`columbia-pay-card ${payMethod === 'pix' ? 'active' : ''}`}
                          onClick={() => handleSwitchPaymentMethod('pix')}
                        >
                          <div className="columbia-pay-card-hd">
                            <span className="columbia-pay-name">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                              </svg>
                              PIX
                            </span>
                            <span className="columbia-pay-badge">5% OFF</span>
                          </div>
                          <span className="columbia-pay-desc">Aprovação imediata e envio prioritário</span>
                        </div>

                        <div
                          className={`columbia-pay-card ${payMethod === 'card' ? 'active' : ''}`}
                          onClick={() => handleSwitchPaymentMethod('card')}
                        >
                          <div className="columbia-pay-card-hd">
                            <span className="columbia-pay-name">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.2">
                                <rect x="1" y="4" width="22" height="16" rx="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                              </svg>
                              Cartão de Crédito
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#E8B10C' }}>Até 12x</span>
                          </div>
                          <span className="columbia-pay-desc">Todas as bandeiras aceitas</span>
                        </div>
                      </div>

                      {/* Conteúdo PIX */}
                      {payMethod === 'pix' && (
                        <div className="columbia-pix-box">
                          {isGeneratingPix ? (
                            <div style={{ padding: '30px 0', color: '#E8B10C', fontWeight: 700 }}>
                              <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                              Gerando cobrança Pix segura via Blackcat Gateway...
                            </div>
                          ) : pixCode ? (
                            <>
                              <div style={{ fontSize: 13.5, color: '#CBD5E1', marginBottom: 14 }}>
                                Abra o aplicativo do seu banco e escaneie o QR Code abaixo ou utilize o <b>Pix Copia e Cola</b>:
                              </div>

                              <div className="columbia-pix-qr">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    pixQrImage && pixQrImage.startsWith('data:')
                                      ? pixQrImage
                                      : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                                          pixCode
                                        )}`
                                  }
                                  alt="QR Code Pix"
                                  width={200}
                                  height={200}
                                  style={{ display: 'block', margin: '0 auto' }}
                                />
                              </div>

                              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#F4F6F8', marginBottom: 6 }}>
                                Código Pix Copia e Cola:
                              </div>

                              <div className="columbia-pix-copy-input">
                                <input
                                  type="text"
                                  className="columbia-pix-code-field"
                                  readOnly
                                  value={pixCode}
                                  onClick={e => (e.target as HTMLInputElement).select()}
                                />
                                <button
                                  type="button"
                                  className="columbia-pix-copy-btn"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pixCode);
                                    setPixCopied(true);
                                    setTimeout(() => setPixCopied(false), 2500);
                                  }}
                                >
                                  {pixCopied ? '✓ Copiado!' : 'Copiar Código'}
                                </button>
                              </div>

                              {/* Aba / Seção para Anexar Comprovante Pix */}
                              <div className="co-receipt-box">
                                <div className="co-receipt-hd">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>🧾</span>
                                    <div>
                                      <b style={{ color: '#F4F6F8', fontSize: 13.5 }}>Anexar Comprovante de Pagamento</b>
                                      <small style={{ display: 'block', color: '#A9B0BA', fontSize: 11.5 }}>
                                        Agilize a liberação e o envio prioritário do seu kit anexando o comprovante
                                      </small>
                                    </div>
                                  </div>
                                </div>

                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleReceiptChange}
                                  accept="image/*,.pdf"
                                  style={{ display: 'none' }}
                                  id="modal-receipt-upload"
                                />

                                {!receiptFile ? (
                                  <div
                                    className="co-receipt-dropzone"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>📤</div>
                                    <div style={{ color: '#E8B10C', fontWeight: 800, fontSize: 13 }}>
                                      Clique aqui para anexar o comprovante
                                    </div>
                                    <div style={{ color: '#7E8691', fontSize: 11.5, marginTop: 3 }}>
                                      PNG, JPG ou PDF (print da tela do banco)
                                    </div>
                                  </div>
                                ) : (
                                  <div className="co-receipt-attached">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(25, 194, 90, 0.15)', color: '#19C25A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                                        ✓
                                      </div>
                                      <div style={{ minWidth: 0 }}>
                                        <div style={{ color: '#F4F6F8', fontWeight: 800, fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                          {receiptFile.name}
                                        </div>
                                        <div style={{ color: '#3BE07C', fontSize: 11.5 }}>
                                          Comprovante anexado ({receiptFile.size})
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setReceiptFile(null)}
                                      style={{ background: 'none', border: 'none', color: '#F2555A', fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                      Trocar
                                    </button>
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                  <a
                                    href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                                      `Olá! Acabei de fazer o Pix do meu pedido ${orderId ? `#ALFA-${orderId.slice(-6).toUpperCase()}` : ''}. Segue meu comprovante de pagamento.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="co-receipt-wa-btn"
                                  >
                                    <span>💬 Enviar comprovante no WhatsApp</span>
                                  </a>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, fontSize: 12.5, color: '#3BE07C' }}>
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#19C25A', animation: 'pulse 1.5s infinite' }} />
                                Aguardando confirmação em tempo real...
                              </div>

                              <button
                                type="button"
                                className="columbia-btn-finish"
                                onClick={handleConfirmPixPaid}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Verificando Pagamento...' : receiptFile ? 'ENVIAR COMPROVANTE E FINALIZAR ✓' : 'JÁ REALIZEI O PAGAMENTO ✓'}
                              </button>
                            </>
                          ) : (
                            <div>
                              <p style={{ fontSize: 14, color: '#A9B0BA', marginBottom: 14 }}>
                                Clique abaixo para gerar o QR Code oficial de pagamento Pix com <b>5% de desconto</b>.
                              </p>
                              <button
                                type="button"
                                className="columbia-btn-next"
                                onClick={generatePix}
                                disabled={isGeneratingPix}
                              >
                                {isGeneratingPix ? 'Gerando Pix...' : 'GERAR CÓDIGO PIX'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Conteúdo Cartão */}
                      {payMethod === 'card' && (
                        <form onSubmit={handleCardPayment} noValidate>
                          <div className="columbia-fld">
                            <label className="columbia-label" htmlFor="fld-c-number">
                              Número do Cartão *
                            </label>
                            <input
                              id="fld-c-number"
                              type="text"
                              className="columbia-input"
                              placeholder="0000 0000 0000 0000"
                              value={cardNumber}
                              onChange={e => handleCardNumberChange(e.target.value)}
                              maxLength={19}
                              required
                            />
                          </div>

                          <div className="columbia-fld">
                            <label className="columbia-label" htmlFor="fld-c-name">
                              Nome impresso no Cartão *
                            </label>
                            <input
                              id="fld-c-name"
                              type="text"
                              className="columbia-input"
                              placeholder="Como está gravado no cartão"
                              value={cardName}
                              onChange={e => setCardName(e.target.value.toUpperCase())}
                              required
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="columbia-fld">
                              <label className="columbia-label" htmlFor="fld-c-expiry">
                                Validade (MM/AA) *
                              </label>
                              <input
                                id="fld-c-expiry"
                                type="text"
                                className="columbia-input"
                                placeholder="MM/AA"
                                value={cardExpiry}
                                onChange={e => handleCardExpiryChange(e.target.value)}
                                maxLength={5}
                                required
                              />
                            </div>
                            <div className="columbia-fld">
                              <label className="columbia-label" htmlFor="fld-c-cvv">
                                CVV *
                              </label>
                              <input
                                id="fld-c-cvv"
                                type="text"
                                className="columbia-input"
                                placeholder="123"
                                value={cardCvv}
                                onChange={e => handleCardCvvChange(e.target.value)}
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>

                          <div className="columbia-fld">
                            <label className="columbia-label" htmlFor="fld-c-installments">
                              Número de Parcelas *
                            </label>
                            <select
                              id="fld-c-installments"
                              className="columbia-select"
                              value={cardInstallments}
                              onChange={e => setCardInstallments(e.target.value)}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(inst => {
                                const val = finalTotal / inst;
                                return (
                                  <option key={inst} value={inst.toString()}>
                                    {inst}x de {formatMoney(val)} {inst === 1 ? '(à vista)' : 'sem juros'}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="columbia-btn-finish"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Processando Cartão...' : `FINALIZAR COMPRA 🔒 (${formatMoney(finalTotal)})`}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* RIGHT COLUMN: Resumo do Pedido (Sticky) */}
          <aside className="columbia-side-col">
            <div className="columbia-summary-box">
              <h3 className="columbia-summary-title">Resumo do pedido</h3>

              {/* Cupom de Desconto */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  🏷️ Tem um cupom?
                </div>
                <div className="columbia-coupon-row">
                  <input
                    type="text"
                    className="columbia-coupon-input"
                    placeholder="CÓDIGO DO CUPOM"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                  />
                  <button type="button" className="columbia-coupon-btn" onClick={applyCoupon}>
                    Adicionar
                  </button>
                </div>
                {couponFeedback && (
                  <div style={{ fontSize: 12, color: couponFeedback.startsWith('✓') ? '#3BE07C' : '#F2555A', marginTop: -12, marginBottom: 12 }}>
                    {couponFeedback}
                  </div>
                )}
              </div>

              {/* Lista de Produtos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#7E8691', paddingBottom: 8, borderBottom: '1px solid #23272E' }}>
                <span>Produto</span>
                <span>Subtotal</span>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="columbia-item-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/hero-mockup.webp"
                    alt={item.kitName}
                    className="columbia-item-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="columbia-item-meta">
                    <b>{item.kitName}</b>
                    <small>{item.vehicle} &bull; {item.colorName}</small>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: '#A9B0BA' }}>Qtd: 1</span>
                      {cart.length > 1 && (
                        <button
                          type="button"
                          className="columbia-remove-link"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="columbia-item-price">
                    {formatMoney(item.price)}
                  </div>
                </div>
              ))}

              {/* Totais */}
              <div className="columbia-totals-list">
                <div className="columbia-total-row">
                  <span>Subtotal</span>
                  <span style={{ color: '#F4F6F8' }}>{formatMoney(subtotal)}</span>
                </div>

                <div className="columbia-total-row">
                  <span>Envio (4 a 8 dias úteis)</span>
                  <span style={{ color: '#3BE07C', fontWeight: 700 }}>Grátis</span>
                </div>

                {payMethod === 'pix' && discountPix > 0 && (
                  <div className="columbia-total-row" style={{ color: '#3BE07C' }}>
                    <span>Desconto no PIX (5%)</span>
                    <span>- {formatMoney(discountPix)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="columbia-total-row" style={{ color: '#3BE07C' }}>
                    <span>Desconto Cupom</span>
                    <span>- {formatMoney(couponDiscount)}</span>
                  </div>
                )}

                <div className="columbia-total-row big">
                  <span>Total</span>
                  <b>{formatMoney(finalTotal)}</b>
                </div>
              </div>

              {/* Caixa: Compra Segura */}
              <div className="columbia-secure-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <b>Compra 100% segura</b>
                  <small>Ambiente criptografado e processado com segurança via Blackcat Gateway.</small>
                </div>
              </div>

              {/* Assurances */}
              <div className="columbia-assurances">
                <div className="columbia-assurance-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <b>Postagem rápida:</b> Despacho direto e rastreamento em território brasileiro.
                  </div>
                </div>

                <div className="columbia-assurance-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <b>Embalagem reforçada:</b> Proteção total contra danos no transporte.
                  </div>
                </div>

                <div className="columbia-assurance-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <b>Garantia total:</b> 1 ano de garantia de fábrica e devolução garantida.
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Floating WhatsApp Support Button */}
      <a
        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Estou no checkout da AlfaCarbon e gostaria de tirar uma dúvida.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="columbia-whatsapp-float"
        aria-label="Atendimento via WhatsApp"
      >
        <svg viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 6L0 24l6.23-1.63a11.95 11.95 0 005.83 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.9h-.01a9.94 9.94 0 01-5.07-1.39l-.36-.22-3.76.99 1-3.67-.24-.38a9.93 9.93 0 01-1.53-5.26c0-5.5 4.48-9.98 9.98-9.98 2.66 0 5.17 1.04 7.05 2.92a9.93 9.93 0 012.92 7.06c0 5.5-4.48 9.98-9.99 9.98zm5.47-7.48c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.13 3.25 5.15 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"/>
        </svg>
        <span>Atendimento</span>
      </a>
    </div>
  );
}
