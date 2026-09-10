'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney } from '@/data/config';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart } = useStore();

  const [step, setStep] = useState<'form' | 'pay' | 'result'>('form');
  const [payMethod, setPayMethod] = useState<'pix' | 'card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Blackcat Gateway State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [payError, setPayError] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Form Fields
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [referencia, setReferencia] = useState('');
  const [formError, setFormError] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepFeedback, setCepFeedback] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');

  const numeroInputRef = useRef<HTMLInputElement>(null);
  const mainTopRef = useRef<HTMLDivElement>(null);

  // Timer
  const [clock, setClock] = useState('00:15:00');

  useEffect(() => {
    let sec = 900;
    const timer = setInterval(() => {
      sec--;
      if (sec < 0) {
        clearInterval(timer);
        return;
      }
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setClock(`00:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalOld = cart.reduce((sum, item) => sum + item.priceOld, 0);
  const discount = totalOld - total;

  // Busca instantânea de CEP via ViaCEP
  const handleCepChange = async (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
    setCep(masked);

    if (raw.length === 8) {
      setIsSearchingCep(true);
      setCepFeedback('Buscando endereço…');
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

  // Gerar PIX via Blackcat
  const generatePix = useCallback(async () => {
    setIsGeneratingPix(true);
    setPayError('');
    try {
      const res = await fetch('/api/blackcat/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
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

        // Inicia polling para detectar pagamento automático
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/blackcat/status/${txnId}`);
            const statusData = await statusRes.json();
            if (statusData.success && statusData.data?.status === 'PAID') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setOrderId(txnId);
              setStep('result');
              clearCart();
              mainTopRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  }, [cart, nome, sobrenome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, estado, clearCart]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !sobrenome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !cep.trim() || !rua.trim() || !numero.trim() || !cidade.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios marcados com *.');
      return;
    }
    setFormError('');
    setStep('pay');
    mainTopRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Se estiver no Pix, já inicia a geração com a Blackcat
    if (payMethod === 'pix' && !pixCode) {
      setTimeout(() => {
        generatePix();
      }, 50);
    }
  };

  const handleSwitchPaymentMethod = (method: 'pix' | 'card') => {
    setPayMethod(method);
    setPayError('');
    if (method === 'pix' && !pixCode) {
      generatePix();
    }
  };

  // Finalizar Pagamento com Cartão ou Confirmação Manual
  const handleCompleteOrder = async () => {
    if (payMethod === 'card') {
      if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setPayError('Por favor, preencha todos os dados do cartão de crédito.');
        return;
      }

      setIsSubmitting(true);
      setPayError('');

      try {
        const deviceData = {
          http_browser_language: typeof navigator !== 'undefined' ? navigator.language : 'pt-BR',
          http_browser_color_depth: typeof window !== 'undefined' ? window.screen?.colorDepth : 24,
          http_browser_screen_height: typeof window !== 'undefined' ? window.screen?.height : 1080,
          http_browser_screen_width: typeof window !== 'undefined' ? window.screen?.width : 1920,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        };

        const res = await fetch('/api/blackcat/create-sale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cart,
            customer: { nome, sobrenome, email, telefone, cpf },
            address: { cep, rua, numero, complemento, bairro, cidade, estado },
            paymentMethod: 'card',
            cardData: {
              number: cardNumber,
              holderName: cardName,
              expiry: cardExpiry,
              cvv: cardCvv,
              installments: cardInstallments,
            },
            device: deviceData,
          }),
        });

        const data = await res.json();

        if (data.success && data.data) {
          const txnId = data.data.transactionId;
          setOrderId(txnId);

          if (data.data.status === 'PAID') {
            setIsSubmitting(false);
            setStep('result');
            clearCart();
            mainTopRef.current?.scrollIntoView({ behavior: 'smooth' });
          } else if (data.data.status === 'PENDING_3DS' && data.data.threeDS?.start?.acsUrl) {
            // Desafio 3D Secure exigido pelo banco do cliente
            window.location.href = data.data.threeDS.start.acsUrl;
          } else if (data.data.status === 'FAILED') {
            setPayError(data.data.refusedReason?.description || 'Pagamento recusado pela operadora do cartão.');
            setIsSubmitting(false);
          } else {
            // Transação criada com sucesso
            setIsSubmitting(false);
            setStep('result');
            clearCart();
            mainTopRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          setPayError(data.error || data.message || 'Não foi possível autorizar o cartão. Verifique os dados digitados.');
          setIsSubmitting(false);
        }
      } catch {
        setPayError('Erro ao comunicar com a gateway de pagamento Blackcat.');
        setIsSubmitting(false);
      }
    } else {
      // Confirmação manual no Pix
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('result');
        clearCart();
        mainTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 900);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <section className="co" id="checkout" role="dialog" aria-modal="true" aria-label="Finalizar compra">
      {/* Header com 3 Etapas Responsivas */}
      <header className="co-hd">
        <div className="wrap">
          <span className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo.png" alt="AlfaCarbon" width="115" height="40" />
          </span>

          {/* Stepper de 3 etapas com labels adaptáveis */}
          <ol className="co-steps">
            <li className={step === 'form' ? 'on' : 'done'}>
              <i>1</i>
              <span className="step-label-full">Dados &amp; Entrega</span>
              <span className="step-label-short">Dados</span>
            </li>
            <li className={step === 'pay' ? 'on' : step === 'result' ? 'done' : ''}>
              <i>2</i>
              <span className="step-label-full">Pagamento</span>
              <span className="step-label-short">Pagar</span>
            </li>
            <li className={step === 'result' ? 'on' : ''}>
              <i>3</i>
              <span className="step-label-full">Concluído</span>
              <span className="step-label-short">Pronto</span>
            </li>
          </ol>

          <button className="x" onClick={closeCheckout} aria-label="Voltar à loja">✕</button>
        </div>
      </header>

      {/* Selos de Confiança */}
      <ul className="co-seals">
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Compra 100% segura
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <path d="M16 8h4l3 3v5h-7z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Frete grátis em 2 a 5 dias
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          12 meses de garantia
        </li>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
          </svg>
          7 dias para devolução
        </li>
      </ul>

      {/* Mobile Accordion Toggle for Order Summary */}
      <div className="co-mobile-summary-bar">
        <button
          type="button"
          className="co-summary-btn"
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          aria-expanded={isSummaryExpanded}
        >
          <span className="summary-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>{isSummaryExpanded ? 'Ocultar resumo' : `Ver resumo (${cart.length} ${cart.length === 1 ? 'item' : 'itens'})`}</span>
            <span className="summary-arrow">{isSummaryExpanded ? '▲' : '▼'}</span>
          </span>
          <b className="summary-total">{formatMoney(total)}</b>
        </button>
      </div>

      <div className="co-body">
        <div className="wrap co-grid">

          {/* Coluna Principal */}
          <div className="co-main" ref={mainTopRef}>

            {/* Passo 1: Formulário e Endereço */}
            {step === 'form' && (
              <form className="co-form" onSubmit={handleContinueToPayment} noValidate>
                <div className="co-step-badge">
                  <span>Etapa 1 de 3</span>
                  <h2>Dados Pessoais e de Entrega</h2>
                </div>

                <div className="co-section-card">
                  <h3 className="co-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    1. Dados de Contato
                  </h3>

                  <div className="co-row">
                    <div className="fld">
                      <label htmlFor="f-nome">Nome *</label>
                      <input
                        id="f-nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Ex: João"
                        required
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="f-sobrenome">Sobrenome *</label>
                      <input
                        id="f-sobrenome"
                        value={sobrenome}
                        onChange={e => setSobrenome(e.target.value)}
                        placeholder="Ex: Silva"
                        required
                      />
                    </div>
                  </div>

                  <div className="co-row">
                    <div className="fld">
                      <label htmlFor="f-email">E-mail *</label>
                      <input
                        id="f-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        required
                      />
                      <small>Enviaremos o código de rastreamento e Nota Fiscal aqui.</small>
                    </div>
                    <div className="fld">
                      <label htmlFor="f-tel">WhatsApp / Celular *</label>
                      <input
                        id="f-tel"
                        type="tel"
                        value={telefone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                      <small>Para atualizações do envio dos Correios.</small>
                    </div>
                  </div>

                  <div className="fld" style={{ marginBottom: 0 }}>
                    <label htmlFor="f-cpf">CPF (obrigatório para emissão de Nota Fiscal) *</label>
                    <input
                      id="f-cpf"
                      value={cpf}
                      onChange={e => handleCpfChange(e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                    <small>Exigido pelos Correios e Receita Federal para envio interestadual seguro.</small>
                  </div>
                </div>

                <div className="co-section-card" style={{ marginTop: '20px' }}>
                  <h3 className="co-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    2. Endereço de Entrega
                  </h3>

                  <div className="co-row">
                    <div className="fld">
                      <label htmlFor="f-cep">CEP *</label>
                      <input
                        id="f-cep"
                        value={cep}
                        onChange={e => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        required
                      />
                      {isSearchingCep ? (
                        <small style={{ color: 'var(--gold)', fontWeight: 600 }}>Buscando endereço…</small>
                      ) : cepFeedback ? (
                        <small style={{ color: cepFeedback.startsWith('✓') ? 'var(--green-dark)' : 'var(--red)', fontWeight: 600 }}>
                          {cepFeedback}
                        </small>
                      ) : (
                        <small>Preenchimento automático via Correios/ViaCEP.</small>
                      )}
                    </div>
                    <div className="fld">
                      <label htmlFor="f-cidade">Cidade *</label>
                      <input
                        id="f-cidade"
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        placeholder="Sua cidade"
                        required
                      />
                    </div>
                  </div>

                  <div className="fld">
                    <label htmlFor="f-rua">Rua / Logradouro *</label>
                    <input
                      id="f-rua"
                      value={rua}
                      onChange={e => setRua(e.target.value)}
                      placeholder="Nome da sua rua ou avenida"
                      required
                    />
                  </div>

                  <div className="co-row">
                    <div className="fld">
                      <label htmlFor="f-numero">Número *</label>
                      <input
                        id="f-numero"
                        ref={numeroInputRef}
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        placeholder="Ex: 123"
                        required
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="f-compl">Complemento / Apto <span>(opcional)</span></label>
                      <input
                        id="f-compl"
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                        placeholder="Apto 42, Bloco B"
                      />
                    </div>
                  </div>

                  <div className="co-row">
                    <div className="fld">
                      <label htmlFor="f-bairro">Bairro *</label>
                      <input
                        id="f-bairro"
                        value={bairro}
                        onChange={e => setBairro(e.target.value)}
                        placeholder="Seu bairro"
                        required
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="f-uf">Estado *</label>
                      <select
                        id="f-uf"
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        required
                      >
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="fld" style={{ marginBottom: 0 }}>
                    <label htmlFor="f-ref">Ponto de referência <span>(opcional)</span></label>
                    <input
                      id="f-ref"
                      value={referencia}
                      onChange={e => setReferencia(e.target.value)}
                      placeholder="Próximo à padaria, portão branco, etc."
                    />
                  </div>
                </div>

                {formError && (
                  <p className="co-err" role="alert">{formError}</p>
                )}

                <button className="btn btn-buy btn-lg co-next-btn" type="submit">
                  <span>Ir para o Pagamento (Etapa 2 de 3)</span>
                  <span style={{ fontSize: '18px' }}>&rarr;</span>
                </button>
              </form>
            )}

            {/* Passo 2: Pagamento */}
            {step === 'pay' && (
              <div className="co-pay">
                <button className="co-back" type="button" onClick={() => setStep('form')}>
                  &larr; Voltar para Dados &amp; Entrega
                </button>

                <div className="co-step-badge">
                  <span>Etapa 2 de 3</span>
                  <h2>Forma de Pagamento</h2>
                </div>

                <p className="co-note">
                  🔒 Ambiente 100% seguro com criptografia SSL de 256 bits via Blackcat Gateway. Seus dados financeiros não são armazenados.
                </p>

                {payError && (
                  <p className="co-err" role="alert">{payError}</p>
                )}

                {/* Seletor de Pagamento: Apenas Pix e Cartão */}
                <div className="co-pay-grid">
                  <button
                    type="button"
                    className={`co-pay-opt ${payMethod === 'pix' ? 'on' : ''}`}
                    onClick={() => handleSwitchPaymentMethod('pix')}
                  >
                    <div className="co-pay-opt-hd">
                      <span className="co-pay-opt-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B84A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        PIX
                      </span>
                      <span className="co-pay-opt-badge" style={{ background: '#EBF8F0', color: '#00B84A' }}>
                        Aprovação Instantânea
                      </span>
                    </div>
                    <span className="co-pay-opt-desc">Envio prioritário imediato · Sem taxas</span>
                  </button>

                  <button
                    type="button"
                    className={`co-pay-opt ${payMethod === 'card' ? 'on' : ''}`}
                    onClick={() => handleSwitchPaymentMethod('card')}
                  >
                    <div className="co-pay-opt-hd">
                      <span className="co-pay-opt-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Cartão de Crédito
                      </span>
                      <span className="co-pay-opt-badge" style={{ background: 'rgba(232, 177, 12, 0.12)', color: 'var(--gold)' }}>
                        Até 12x
                      </span>
                    </div>
                    <span className="co-pay-opt-desc">Visa, Mastercard, Elo, Amex · Seguro</span>
                  </button>
                </div>

                {/* Conteúdo PIX */}
                {payMethod === 'pix' && (
                  <div className="co-pay-box" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EBF8F0', borderRadius: '999px', color: '#00B84A', fontWeight: 800, fontSize: '13px', marginBottom: '14px' }}>
                      ⚡ Pagamento Instantâneo com Envio Prioritário
                    </div>
                    <h3 style={{ color: 'var(--green-dark)', marginBottom: '8px', fontSize: '1.15rem' }}>
                      Pague com Pix e garanta envio imediato
                    </h3>
                    <p style={{ fontSize: '13.5px', marginBottom: '18px', color: 'var(--ink-2)', maxWidth: '480px', marginInline: 'auto' }}>
                      Abra o aplicativo do seu banco, escolha <b>Pagar com Pix</b> e aponte a câmera para o QR Code ou copie o código abaixo:
                    </p>

                    {isGeneratingPix ? (
                      <div style={{ padding: '40px 20px', color: 'var(--ink-2)' }}>
                        <div style={{ width: '36px', height: '36px', border: '3px solid var(--line-strong)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 600 }}>Gerando chave Pix oficial com a Blackcat...</p>
                      </div>
                    ) : (
                      <>
                        <div style={{ background: '#fff', padding: '16px', display: 'inline-block', borderRadius: '12px', marginBottom: '18px', border: '1px solid var(--line)' }}>
                          {pixQrImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pixQrImage} alt="QR Code Pix" width="190" height="190" style={{ display: 'block', borderRadius: '4px' }} />
                          ) : (
                            /* QR Code Pix Render */
                            <svg width="180" height="180" viewBox="0 0 100 100" fill="#000">
                              <rect width="30" height="30" fill="#000" />
                              <rect x="5" y="5" width="20" height="20" fill="#fff" />
                              <rect x="10" y="10" width="10" height="10" fill="#000" />

                              <rect x="70" width="30" height="30" fill="#000" />
                              <rect x="75" y="5" width="20" height="20" fill="#fff" />
                              <rect x="80" y="10" width="10" height="10" fill="#000" />

                              <rect y="70" width="30" height="30" fill="#000" />
                              <rect x="5" y="75" width="20" height="20" fill="#fff" />
                              <rect x="10" y="80" width="10" height="10" fill="#000" />

                              <rect x="40" y="10" width="20" height="10" fill="#000" />
                              <rect x="40" y="30" width="10" height="20" fill="#000" />
                              <rect x="60" y="40" width="20" height="10" fill="#000" />
                              <rect x="40" y="70" width="30" height="10" fill="#000" />
                              <rect x="80" y="70" width="10" height="20" fill="#000" />
                            </svg>
                          )}
                        </div>

                        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
                          <input
                            readOnly
                            value={pixCode || 'Gerando chave Pix...'}
                            style={{ width: '100%', padding: '11px', fontSize: '12px', textAlign: 'center', background: 'var(--bg-soft)', border: '1px solid var(--line)', color: 'var(--ink-2)', borderRadius: '6px', marginBottom: '12px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-line btn-lg"
                            style={{ fontSize: '14px', padding: '12px 20px', width: '100%' }}
                            onClick={() => {
                              if (pixCode) {
                                navigator.clipboard?.writeText(pixCode);
                                setPixCopied(true);
                                setTimeout(() => setPixCopied(false), 3000);
                              }
                            }}
                          >
                            {pixCopied ? '✓ Código Pix Copiado com Sucesso!' : '📋 Copiar Código Pix (Copia e Cola)'}
                          </button>
                        </div>
                      </>
                    )}

                    <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-soft)', borderRadius: '8px', fontSize: '12.5px', color: 'var(--ink-2)', textAlign: 'left' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ink)' }}>Como pagar com Pix:</p>
                      <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
                        <li>Abra o aplicativo do seu banco ou carteira digital.</li>
                        <li>Selecione a opção <b>Pix &gt; Pagar com QR Code</b> ou <b>Pix Copia e Cola</b>.</li>
                        <li>Cole o código acima ou escaneie o QR Code e confirme. A aprovação é imediata!</li>
                      </ol>
                    </div>

                    <button
                      className="btn btn-buy btn-lg co-next-btn"
                      style={{ marginTop: '20px' }}
                      onClick={handleCompleteOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Verificando pagamento…' : `Já realizei o pagamento Pix · ${formatMoney(total)}`}
                    </button>
                  </div>
                )}

                {/* Conteúdo Cartão de Crédito */}
                {payMethod === 'card' && (
                  <div className="co-pay-box">
                    <h3 style={{ marginBottom: '14px', fontSize: '15px' }}>Dados do Cartão de Crédito</h3>
                    
                    <div className="fld">
                      <label>Número do cartão *</label>
                      <input
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardNumber}
                        onChange={e => handleCardNumberChange(e.target.value)}
                      />
                    </div>
                    <div className="fld">
                      <label>Nome impresso no cartão *</label>
                      <input
                        placeholder="Como está grafado no cartão"
                        value={cardName}
                        onChange={e => setCardName(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="co-row">
                      <div className="fld">
                        <label>Validade *</label>
                        <input
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={e => handleCardExpiryChange(e.target.value)}
                        />
                      </div>
                      <div className="fld">
                        <label>CVV *</label>
                        <input
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={e => handleCardCvvChange(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="fld" style={{ marginBottom: 0 }}>
                      <label>Opções de Parcelamento</label>
                      <select value={cardInstallments} onChange={e => setCardInstallments(e.target.value)}>
                        <option value="1">1x de {formatMoney(total)} (sem juros)</option>
                        <option value="2">2x de {formatMoney(Math.ceil(total / 2))} (sem juros)</option>
                        <option value="3">3x de {formatMoney(Math.ceil(total / 3))} (sem juros)</option>
                        <option value="6">6x de {formatMoney(Math.ceil(total / 6))} (sem juros)</option>
                        <option value="12">12x de {formatMoney(Math.ceil(total / 12))} (sem juros)</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-buy btn-lg co-next-btn"
                      style={{ marginTop: '24px' }}
                      onClick={handleCompleteOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Processando pagamento seguro com a Blackcat…'
                      ) : (
                        <>
                          <span>🔒 Finalizar Pedido no Cartão · {formatMoney(total)}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-3)', marginTop: '12px' }}>
                  Pagamento protegido com criptografia bancária SSL de 256 bits via Blackcat Gateway.
                </p>
              </div>
            )}

            {/* Passo 3: Concluído */}
            {step === 'result' && (
              <div className="co-result">
                <div className="ico ok">✓</div>
                <div className="co-step-badge" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                  <span>Etapa 3 de 3 · Sucesso</span>
                </div>
                <h2>Pedido Confirmado com Sucesso!</h2>
                <p>
                  Obrigado, <b>{nome}</b>! Seu pedido foi processado com segurança pela <b>Blackcat Gateway</b> e registrado em nossa loja oficial <b>alfacarbon.shop</b>. Já foi encaminhado para a calibragem do molde 3D.
                </p>

                <span className="ref">
                  Código do Pedido: <b>#{orderId || transactionId}</b>
                </span>

                <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--r)', border: '1px solid var(--line)', textAlign: 'left', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13.5px', marginBottom: '8px', color: 'var(--ink)' }}>
                    📍 <b>Endereço de entrega:</b> {rua}, {numero} {complemento ? `- ${complemento}` : ''}, {bairro}, {cidade} - {estado}, CEP {cep}
                  </p>
                  <p style={{ fontSize: '13.5px', marginBottom: '8px', color: 'var(--ink)' }}>
                    📦 <b>Envio:</b> Correios / Transportadora com código de rastreamento enviado via WhatsApp.
                  </p>
                  <p style={{ fontSize: '13.5px', margin: 0, color: 'var(--ink-2)' }}>
                    📧 Confirmação e Nota Fiscal enviadas para <b>{email}</b>.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    className="btn btn-buy btn-lg"
                    href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Olá, realizei o pedido #${orderId || transactionId} no site alfacarbon.shop e gostaria de acompanhar o envio.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 Acompanhar Pedido no WhatsApp
                  </a>
                  <button className="btn btn-line btn-lg" onClick={closeCheckout}>
                    Voltar à Loja
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Coluna Lateral: Resumo do Pedido */}
          <aside className={`co-side ${isSummaryExpanded ? 'mobile-expanded' : ''}`}>
            <div className="co-side-hd">
              <h2>Resumo do seu pedido</h2>
              <span className="badge">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
            </div>

            <div id="co-items">
              {cart.map(item => (
                <div className="ci" key={item.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/img/kit-${item.kit}-${item.color}.webp`} alt={item.kitName} loading="lazy" />
                  <div className="m">
                    <b>{item.kitName}</b>
                    <small>{item.vehicle}</small>
                    <small>Cor: {item.colorName}</small>
                  </div>
                  <span className="p">{formatMoney(item.price)}</span>
                </div>
              ))}
            </div>

            <div id="co-totals">
              <div className="tot">
                <span>Preço de tabela</span>
                <s>{formatMoney(totalOld)}</s>
              </div>
              <div className="tot">
                <span>Desconto promocional</span>
                <span style={{ color: 'var(--green-dark)' }}>− {formatMoney(discount)}</span>
              </div>
              <div className="tot">
                <span>Frete</span>
                <span style={{ color: 'var(--green-dark)' }}>Grátis</span>
              </div>
              <div className="tot big">
                <span>Total</span>
                <b>{formatMoney(total)}</b>
              </div>
            </div>

            <div className="co-envio">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div>
                <b>Frete grátis para todo o Brasil</b>
                <small>Chega em <b>2 a 5 dias úteis</b>, com código de rastreamento</small>
              </div>
            </div>

            <p className="co-timer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Seu preço fica reservado por <b><time>{clock}</time></b>
            </p>

            <ul className="co-assur">
              <li>Frete grátis · chega em 2 a 5 dias úteis</li>
              <li>7 dias para troca ou devolução incondicional</li>
              <li>12 meses de garantia de fábrica</li>
            </ul>

            {/* Selo de Segurança Blindada */}
            <div className="mp-trust">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <b>Ambiente 100% Seguro e Criptografado</b>
                <small>Certificação SSL de 256 bits via Blackcat. Seus dados trafegam protegidos e sob sigilo absoluto.</small>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
