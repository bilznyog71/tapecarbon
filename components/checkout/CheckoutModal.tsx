'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney } from '@/data/config';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart, removeFromCart } = useStore();

  // 3 etapas sequenciais: 1 = Identificação, 2 = Entrega, 3 = Pagamento, 4 = Concluído
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  // Blackcat Gateway State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [payError, setPayError] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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


  // Itens do carrinho
  const cartItems = cart.length > 0 ? cart : [
    {
      id: 'default-kit',
      vehicle: 'Universal / Personalizado',
      kit: 'carro_sem',
      kitName: 'Kit Tapetes Interno Sob Medida',
      color: 'preto',
      colorName: 'Preto',
      texture: 'textura-a',
      textureName: 'Textura A',
      price: 146.83,
      priceOld: 267.97,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountPix = Math.round(subtotal * 0.05);
  const finalTotal = Math.max(0, subtotal - discountPix);
  const isPixGenerated = activeStep === 3 && Boolean(pixCode);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    modalContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Busca instantânea de CEP via ViaCEP
  const handleCepChange = async (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
    setCep(masked);

    if (raw.length === 8) {
      setIsSearchingCep(true);
      setCepFeedback('Localizando...');
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || 'SP');
          setCepFeedback(`✓ ${data.localidade} - ${data.uf}`);
          setTimeout(() => {
            numeroInputRef.current?.focus();
          }, 100);
        } else {
          setCepFeedback('CEP não localizado. Preencha manualmente.');
        }
      } catch {
        setCepFeedback('');
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


  // Gerador PIX Blackcat com valor com desconto exato
  const generatePix = useCallback(async (customAmount?: number) => {
    setIsGeneratingPix(true);
    setPayError('');
    try {
      const chargeAmount = typeof customAmount === 'number' ? customAmount : finalTotal;
      const res = await fetch('/api/blackcat/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cartItems,
          customer: { nome, sobrenome, email, telefone, cpf },
          address: { cep, rua, numero, complemento, bairro, cidade, estado },
          paymentMethod: 'pix',
          amount: chargeAmount,
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
          scrollToTop();
        } else if (pData?.qrCode) {
          setPixCode(pData.qrCode);
          scrollToTop();
        }
        if (pData?.qrCodeBase64) {
          setPixQrImage(pData.qrCodeBase64);
        }

        // Polling de status em tempo real
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
        setPayError(data.error || data.message || 'Não foi possível gerar a cobrança Pix.');
      }
    } catch {
      setPayError('Erro de conexão com o servidor de pagamento. Tente novamente.');
    } finally {
      setIsGeneratingPix(false);
    }
  }, [cartItems, nome, sobrenome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, estado, finalTotal, clearCart]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Validação da Etapa 1
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nome.trim() || !sobrenome.trim() || !telefone.trim() || !cpf.trim()) {
      setStep1Error('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    const cleanEmail = email.trim();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStep1Error('Informe um e-mail válido.');
      return;
    }
    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStep1Error('Informe um telefone válido com DDD.');
      return;
    }
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length < 11) {
      setStep1Error('Informe um CPF válido.');
      return;
    }

    setStep1Error('');
    setActiveStep(2);
    scrollToTop();
  };

  // Validação da Etapa 2
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setStep2Error('Digite um CEP válido com 8 dígitos.');
      return;
    }
    if (!rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      setStep2Error('Preencha o endereço completo com número e bairro.');
      return;
    }

    setStep2Error('');
    setActiveStep(3);
    scrollToTop();

    if (!pixCode) {
      setTimeout(() => {
        generatePix(finalTotal);
      }, 50);
    }
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
      {/* Top Header */}
      <header className="columbia-co-hd">
        <div className="wrap">
          <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={closeCheckout}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/logo.png"
              alt="AlfaCarbon"
              style={{ height: 30, width: 'auto' }}
            />
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div className="columbia-secure-tag">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#19C25A" strokeWidth="2.4">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>100% Seguro</span>
            </div>

            <button
              type="button"
              onClick={closeCheckout}
              aria-label="Fechar checkout"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid #282E38',
                color: '#CBD5E1',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </header>

      <div className="columbia-co-body">
        <div className={`wrap columbia-co-grid ${isPixGenerated ? 'yampi-mode' : ''}`}>
          
          {/* COLUNA ESQUERDA: 3 ETAPAS SEQUENCIAIS OU TELA EXCLUSIVA PIX */}
          <div className={`columbia-main-col ${isPixGenerated ? 'yampi-pix-full' : ''}`}>
            
            {activeStep === 4 ? (
              /* Concluído */
              <div className="columbia-step-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(25, 194, 90, 0.15)',
                    border: '2px solid #19C25A',
                    color: '#19C25A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                    fontSize: 30,
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F4F6F8', margin: '0 0 8px' }}>
                  Pedido Realizado com Sucesso!
                </h2>
                <p style={{ fontSize: 13.5, color: '#A9B0BA', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Agradecemos a sua preferência e confiança na AlfaCarbon.
                </p>

                <div
                  style={{
                    background: '#111317',
                    border: '1px solid #282E38',
                    borderRadius: 10,
                    padding: '14px 20px',
                    display: 'inline-block',
                    textAlign: 'left',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontSize: 11.5, color: '#7E8691', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Código do Pedido:</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#E8B10C', marginTop: 2 }}>
                    #{orderId ? orderId.slice(-8).toUpperCase() : 'ALFA-78921'}
                  </div>
                  <div style={{ fontSize: 12, color: '#3BE07C', marginTop: 4 }}>
                    ● Previsão de entrega: 4 a 8 dias úteis
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="columbia-btn-next"
                    onClick={closeCheckout}
                    style={{ maxWidth: 240, margin: '0 auto' }}
                  >
                    Voltar à Loja
                  </button>
                </div>
              </div>
            ) : isPixGenerated ? (
              /* TELA EXCLUSIVA DO PIX (ESTILO YAMPI / CORVEX - SEM OUTRAS ETAPAS) */
              <div className="yampi-pix-card">
                <div className="yampi-pix-header">
                  <div className="yampi-pix-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Pague com Pix · Aprovação Imediata
                  </div>

                  <div className="yampi-pix-amount-label">Total a pagar com 5% de desconto:</div>
                  <div className="yampi-pix-amount-val">{formatMoney(finalTotal)}</div>
                  <div className="yampi-pix-order-id">
                    Código do Pedido: #{orderId ? orderId.slice(-8).toUpperCase() : 'ALFA-78921'}
                  </div>

                  <div className="yampi-pix-expire-hint">
                    <span>⏱️</span>
                    <span>Código Pix válido por 30 minutos</span>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#CBD5E1', marginBottom: 14 }}>
                  Escaneie o QR Code ou use o botão <b>Copiar Código Pix</b> abaixo:
                </div>

                <div className="columbia-pix-qr-wrapper">
                  <div className="columbia-pix-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        pixQrImage && pixQrImage.startsWith('data:')
                          ? pixQrImage
                          : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                              pixCode
                            )}`
                      }
                      alt="QR Code Pix"
                      width={164}
                      height={164}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="columbia-pix-copy-big-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    setPixCopied(true);
                    setTimeout(() => setPixCopied(false), 2500);
                  }}
                >
                  {pixCopied ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Código Pix Copiado!
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copiar Código Pix (Copia e Cola)
                    </>
                  )}
                </button>

                <div
                  className="columbia-pix-code-preview"
                  title="Clique para copiar"
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    setPixCopied(true);
                    setTimeout(() => setPixCopied(false), 2500);
                  }}
                >
                  <span className="columbia-pix-code-text">{pixCode}</span>
                  <span className="columbia-pix-click-hint">
                    {pixCopied ? '✓ Copiado' : 'Clique p/ copiar'}
                  </span>
                </div>

                <div className="columbia-pix-steps">
                  <div className="columbia-pix-step-item">
                    <span className="columbia-pix-step-num">1</span>
                    <span>Abra o app do seu banco e acesse a área <b>Pix</b>.</span>
                  </div>
                  <div className="columbia-pix-step-item">
                    <span className="columbia-pix-step-num">2</span>
                    <span>Selecione <b>Pix Copia e Cola</b> ou escaneie o <b>QR Code</b> acima.</span>
                  </div>
                  <div className="columbia-pix-step-item">
                    <span className="columbia-pix-step-num">3</span>
                    <span>Conclua o pagamento. Nosso sistema <b>identifica a aprovação automaticamente</b> em segundos!</span>
                  </div>
                </div>

                <div className="columbia-pix-listening-badge">
                  <span className="columbia-pix-listening-dot" />
                  <span>Aguardando confirmação bancária em tempo real...</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPixCode('')}
                  className="yampi-back-btn"
                >
                  ← Voltar ou alterar dados de entrega
                </button>
              </div>
            ) : (
              <>
                {/* ETAPA 1: IDENTIFICAÇÃO */}
                <div className={`columbia-step-card ${activeStep === 1 ? 'active' : 'completed'}`}>
                  {activeStep > 1 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                        <div className="columbia-step-badge done">✓</div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#F4F6F8' }}>1. Identificação</div>
                          <div style={{ fontSize: 12, color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {nome} {sobrenome} · {email}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="columbia-edit-link"
                        onClick={() => setActiveStep(1)}
                        style={{ flexShrink: 0, margin: 0 }}
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="columbia-step-hd">
                        <div className="columbia-step-badge active">1</div>
                        <div>
                          <h2 className="columbia-step-title">Identificação</h2>
                          <p className="columbia-step-sub">Preencha seus dados para envio do pedido.</p>
                        </div>
                      </div>

                      <form className="columbia-step-content" onSubmit={handleStep1Submit} noValidate>
                        {step1Error && (
                          <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '9px 12px', borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div className="columbia-fld">
                            <label className="columbia-label" htmlFor="fld-telefone">
                              WhatsApp / Celular *
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
                          Continuar para Entrega &rarr;
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {/* ETAPA 2: ENTREGA */}
                <div
                  className={`columbia-step-card ${
                    activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : 'locked'
                  }`}
                >
                  {activeStep > 2 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                        <div className="columbia-step-badge done">✓</div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#F4F6F8' }}>2. Entrega</div>
                          <div style={{ fontSize: 12, color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {rua}, {numero} · {bairro}, {cidade} - {estado}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="columbia-edit-link"
                        onClick={() => setActiveStep(2)}
                        style={{ flexShrink: 0, margin: 0 }}
                      >
                        Alterar
                      </button>
                    </div>
                  ) : activeStep === 2 ? (
                    <>
                      <div className="columbia-step-hd">
                        <div className="columbia-step-badge active">2</div>
                        <div>
                          <h2 className="columbia-step-title">Entrega</h2>
                          <p className="columbia-step-sub">Informe onde deseja receber o pedido.</p>
                        </div>
                      </div>

                      <form className="columbia-step-content" onSubmit={handleStep2Submit} noValidate>
                        {step2Error && (
                          <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '9px 12px', borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
                            {step2Error}
                          </div>
                        )}

                        <div className="columbia-fld">
                          <label className="columbia-label" htmlFor="fld-cep">
                            CEP * {isSearchingCep && <span style={{ color: '#E8B10C', fontSize: 11.5 }}> (Buscando...)</span>}
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
                            <div style={{ fontSize: 12, color: cepFeedback.startsWith('✓') ? '#3BE07C' : '#A9B0BA', marginTop: 3 }}>
                              {cepFeedback}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
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

                        {/* Frete Grátis */}
                        <div
                          style={{
                            background: '#111317',
                            border: '1px solid rgba(25, 194, 90, 0.3)',
                            borderRadius: 8,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 6,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>🚚</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#F4F6F8' }}>
                              Frete Expresso Nacional (4 a 8 dias úteis)
                            </span>
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 900, color: '#3BE07C', textTransform: 'uppercase' }}>
                            Grátis
                          </span>
                        </div>

                        <button type="submit" className="columbia-btn-next">
                          Continuar para Pagamento &rarr;
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="columbia-step-hd">
                      <div className="columbia-step-badge idle">2</div>
                      <div className="columbia-step-title" style={{ color: '#7E8691' }}>2. Entrega</div>
                    </div>
                  )}
                </div>

                {/* ETAPA 3: PAGAMENTO */}
                <div
                  className={`columbia-step-card ${
                    activeStep === 3 ? 'active' : 'locked'
                  }`}
                >
                  <div className="columbia-step-hd">
                    <div className={`columbia-step-badge ${activeStep === 3 ? 'active' : 'idle'}`}>
                      3
                    </div>
                    <div>
                      <h2 className="columbia-step-title">3. Pagamento</h2>
                      <p className="columbia-step-sub">Escolha a melhor forma de pagamento.</p>
                    </div>
                  </div>

                  {activeStep === 3 && (
                    <div className="columbia-step-content">
                      {payError && (
                        <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 14 }}>
                          {payError}
                        </div>
                      )}

                      {/* Método de Pagamento Pix Exclusivo */}
                      <div className="columbia-pay-selector" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="columbia-pay-card active" style={{ cursor: 'default' }}>
                          <div className="columbia-pay-card-hd">
                            <span className="columbia-pay-name">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.4">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                              </svg>
                              PIX (Pagamento Oficial)
                            </span>
                            <span className="columbia-pay-badge">5% OFF</span>
                          </div>
                          <span className="columbia-pay-desc">Aprovação imediata · Envio prioritário com código de rastreamento</span>
                        </div>
                      </div>

                      {/* PIX */}
                      <div className="columbia-pix-box">
                        {isGeneratingPix ? (
                          <div style={{ padding: '24px 0', color: '#E8B10C', fontWeight: 700 }}>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>⏳</div>
                            Gerando cobrança Pix segura...
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: 13.5, color: '#A9B0BA', marginBottom: 12 }}>
                              Total a pagar no Pix com 5% de desconto: <b style={{ color: '#E8B10C' }}>{formatMoney(finalTotal)}</b>
                            </p>
                            <button
                              type="button"
                              className="columbia-btn-next"
                              onClick={() => generatePix(finalTotal)}
                              disabled={isGeneratingPix}
                            >
                              {isGeneratingPix ? 'Gerando Pix...' : 'GERAR CÓDIGO PIX'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* COLUNA DIREITA: RESUMO DO PEDIDO (OCULTO NA TELA DO PIX E CONCLUÍDO) */}
          {!isPixGenerated && activeStep !== 4 && (
            <aside className="columbia-side-col">
              <div className="columbia-summary-box">
                <h3 className="columbia-summary-title">Resumo do pedido</h3>

                {/* Itens */}
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
                      <small>{item.vehicle} · Cor: {item.colorName}{item.textureName ? ` · ${item.textureName}` : ''}</small>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                        <span style={{ fontSize: 11.5, color: '#8E98A5' }}>Qtd: 1</span>
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

                  {discountPix > 0 && (
                    <div className="columbia-total-row" style={{ color: '#3BE07C' }}>
                      <span>Desconto no PIX (5%)</span>
                      <span>- {formatMoney(discountPix)}</span>
                    </div>
                  )}

                  <div className="columbia-total-row big">
                    <span>Total</span>
                    <b>{formatMoney(finalTotal)}</b>
                  </div>
                </div>

                {/* Selo Discreto */}
                <div className="columbia-trust-strip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3BE07C" strokeWidth="2.4">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Pagamento Criptografado &amp; Rastreamento Garantido</span>
                </div>

              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Suporte WhatsApp em linha (não obstrui o QR Code ou botões) */}
      <div style={{ textAlign: 'center', padding: '16px 20px 32px' }}>
        <a
          href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Estou no checkout da AlfaCarbon e gostaria de tirar uma dúvida.')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#3BE07C', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}
        >
          <span>💬 Precisa de ajuda? Fale conosco no WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
