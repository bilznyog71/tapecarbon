'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CONFIG, formatMoney } from '@/data/config';

function CheckoutContent() {
  const searchParams = useSearchParams();

  const marca = searchParams.get('marca') || 'Volkswagen';
  const modelo = searchParams.get('modelo') || 'Nivus';
  const ano = searchParams.get('ano') || '2024';
  const kit = searchParams.get('kit') || 'Kit Completo (Interior + Porta-Malas)';
  const cor = searchParams.get('cor') || 'Preto Carbon';
  const rawAmount = searchParams.get('amount') || '247';
  const amount = Number(rawAmount) || 247;

  // 3-step sequential accordion: 1 = Identificação, 2 = Entrega, 3 = Pagamento, 4 = Concluído
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

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

  const subtotal = amount;
  const discountPix = Math.round(subtotal * 0.05 * 100) / 100;
  const finalTotal = Math.max(0, subtotal - discountPix);
  const isPixGenerated = activeStep === 3 && Boolean(pixCode);

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
          setCepFeedback('CEP não encontrado. Preencha o endereço manualmente.');
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

  // PixzyPay Pix Generator com valor exato com desconto e dados camuflados no backend
  const generatePix = useCallback(async (customAmount?: number) => {
    setIsGeneratingPix(true);
    setPayError('');
    try {
      const chargeAmount = typeof customAmount === 'number' ? customAmount : finalTotal;
      const res = await fetch('/api/pixzy/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId: trackingId || undefined,
          cart: [
            {
              kitName: kit,
              vehicle: `${marca} ${modelo} (${ano})`,
              colorName: cor,
              price: amount,
            },
          ],
          customer: { nome, sobrenome, email, telefone, cpf },
          address: { cep, rua, numero, complemento, bairro, cidade, estado },
          paymentMethod: 'pix',
          amount: chargeAmount,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const txnId = data.data.transactionId || data.data.transaction_id;
        const pData = data.data.paymentData;
        const pixString = data.data.br_code || pData?.copyPaste || pData?.qrCode;
        setTransactionId(txnId);
        setOrderId(txnId);
        if (pixString) {
          setPixCode(pixString);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (pData?.qrCodeBase64 || data.data.qr_code) {
          setPixQrImage(pData?.qrCodeBase64 || data.data.qr_code);
        }

        // Real-time polling
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/pixzy/status/${txnId}`);
            const statusData = await statusRes.json();
            if (statusData.success && (statusData.data?.status === 'PAID' || statusData.data?.pixzyStatus === 'paid')) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setOrderId(txnId);
              setActiveStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } catch {}
        }, 3000);
      } else {
        setPayError(data.error || data.message || 'Não foi possível gerar a cobrança Pix na PixzyPay.');
      }
    } catch {
      setPayError('Erro de conexão com o servidor de pagamento. Tente novamente.');
    } finally {
      setIsGeneratingPix(false);
    }
  }, [kit, marca, modelo, ano, cor, amount, nome, sobrenome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, estado, finalTotal, trackingId]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Step 1 Validation -> Dispara Rastreamento de Compra Iniciada -> Next
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Salva compra iniciada em segundo plano para o painel administrativo
    const activeLeadId = trackingId || `LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    if (!trackingId) {
      setTrackingId(activeLeadId);
    }

    fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: activeLeadId,
        customer: {
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          email: cleanEmail,
          telefone: cleanPhone,
          cpf: cleanCpf,
        },
        cart: [
          {
            kitName: kit,
            vehicle: `${marca} ${modelo} (${ano})`,
            colorName: cor,
            price: amount,
          },
        ],
        amount: finalTotal,
        status: 'INICIADA',
      }),
    }).catch(() => {});
  };

  // Step 2 Validation -> Atualiza Rastreamento -> Next
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Atualiza o lead com endereço
    if (trackingId) {
      fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: trackingId,
          customer: { nome, sobrenome, email, telefone, cpf },
          address: { cep: cleanCep, rua, numero, complemento, bairro, cidade, estado },
          cart: [
            {
              kitName: kit,
              vehicle: `${marca} ${modelo} (${ano})`,
              colorName: cor,
              price: amount,
            },
          ],
          amount: finalTotal,
          status: 'INICIADA',
        }),
      }).catch(() => {});
    }

    if (!pixCode) {
      const discounted = Math.max(0, subtotal - Math.round(subtotal * 0.05 * 100) / 100);
      setTimeout(() => {
        generatePix(discounted);
      }, 80);
    }
  };



  return (
    <div className={`wrap columbia-co-grid ${isPixGenerated ? 'yampi-mode' : ''}`}>
      
      {/* LEFT COLUMN: 3-Step Accordion OU Tela Exclusiva Pix */}
      <div className={`columbia-main-col ${isPixGenerated ? 'yampi-pix-full' : ''}`}>
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
              Agradecemos a sua preferência e confiança na AlfaCarbon.
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
              <Link
                href="/"
                className="columbia-btn-next"
                style={{ maxWidth: 280, margin: '0 auto', textDecoration: 'none' }}
              >
                Voltar à Loja
              </Link>
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
            {/* ================= STEP 1: IDENTIFICAÇÃO ================= */}
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
                      <h2 className="columbia-step-title">IDENTIFICAÇÃO</h2>
                      <p className="columbia-step-sub">Preencha seus dados para envio do pedido.</p>
                    </div>
                  </div>

                  <form className="columbia-step-content" onSubmit={handleStep1Submit} noValidate autoComplete="off">
                  {step1Error && (
                    <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                      {step1Error}
                    </div>
                  )}

                  <div className="columbia-fld">
                    <label className="columbia-label" htmlFor="page-email">
                      Endereço de e-mail *
                    </label>
                    <input
                      id="page-email"
                      type="email"
                      className="columbia-input"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-nome">
                        Nome *
                      </label>
                      <input
                        id="page-nome"
                        type="text"
                        className="columbia-input"
                        placeholder="Nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-sobrenome">
                        Sobrenome *
                      </label>
                      <input
                        id="page-sobrenome"
                        type="text"
                        className="columbia-input"
                        placeholder="Sobrenome"
                        value={sobrenome}
                        onChange={e => setSobrenome(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-telefone">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="page-telefone"
                        type="tel"
                        className="columbia-input"
                        placeholder="(11) 98765-4321"
                        value={telefone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-cpf">
                        CPF *
                      </label>
                      <input
                        id="page-cpf"
                        type="text"
                        className="columbia-input"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={e => handleCpfChange(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>


                  <button type="submit" className="columbia-btn-next">
                    PRÓXIMO &rarr;
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ================= STEP 2: ENTREGA ================= */}
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
            ) : (
              <>
                <div className="columbia-step-hd">
                  <div
                    className={`columbia-step-badge ${
                      activeStep === 2 ? 'active' : 'idle'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h2 className="columbia-step-title">ENTREGA</h2>
                    <p className="columbia-step-sub">Informe onde deseja receber o pedido.</p>
                  </div>
                </div>

                {activeStep === 2 && (
                  <form className="columbia-step-content" onSubmit={handleStep2Submit} noValidate>
                  {step2Error && (
                    <div style={{ background: 'rgba(242, 85, 90, 0.12)', border: '1px solid rgba(242, 85, 90, 0.4)', color: '#FFB9BC', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                      {step2Error}
                    </div>
                  )}

                  <div className="columbia-fld">
                    <label className="columbia-label" htmlFor="page-cep">
                      CEP * {isSearchingCep && <span style={{ color: '#E8B10C', fontSize: 12 }}> (Buscando endereço...)</span>}
                    </label>
                    <input
                      id="page-cep"
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
                      <label className="columbia-label" htmlFor="page-rua">
                        Endereço / Rua *
                      </label>
                      <input
                        id="page-rua"
                        type="text"
                        className="columbia-input"
                        placeholder="Ex: Av. Paulista"
                        value={rua}
                        onChange={e => setRua(e.target.value)}
                        required
                      />
                    </div>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-numero">
                        Número *
                      </label>
                      <input
                        id="page-numero"
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
                      <label className="columbia-label" htmlFor="page-complemento">
                        Complemento (opcional)
                      </label>
                      <input
                        id="page-complemento"
                        type="text"
                        className="columbia-input"
                        placeholder="Apto 42, Bloco B"
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                      />
                    </div>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-bairro">
                        Bairro *
                      </label>
                      <input
                        id="page-bairro"
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
                      <label className="columbia-label" htmlFor="page-cidade">
                        Cidade *
                      </label>
                      <input
                        id="page-cidade"
                        type="text"
                        className="columbia-input"
                        placeholder="Cidade"
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        required
                      />
                    </div>
                    <div className="columbia-fld">
                      <label className="columbia-label" htmlFor="page-estado">
                        Estado (UF) *
                      </label>
                      <input
                        id="page-estado"
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

                  {/* Frete Expresso Grátis */}
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
              )}
            </>
          )}
        </div>

            {/* ================= STEP 3: PAGAMENTO ================= */}
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

                  {/* Método de Pagamento Pix Exclusivo */}
                  <div className="columbia-pay-selector" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="columbia-pay-card active" style={{ cursor: 'default' }}>
                      <div className="columbia-pay-card-hd">
                        <span className="columbia-pay-name">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8B10C" strokeWidth="2.2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                          PIX (Pagamento Oficial)
                        </span>
                        <span className="columbia-pay-badge">5% OFF</span>
                      </div>
                      <span className="columbia-pay-desc">Aprovação imediata e envio prioritário</span>
                    </div>
                  </div>

                  {/* Pix */}
                  <div className="columbia-pix-box">
                    {isGeneratingPix ? (
                      <div style={{ padding: '30px 0', color: '#E8B10C', fontWeight: 700 }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                        Gerando cobrança Pix segura via PixzyPay Gateway...
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 14, color: '#A9B0BA', marginBottom: 14 }}>
                          Clique abaixo para gerar o QR Code oficial de pagamento Pix com <b>5% de desconto</b>.
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

      {/* RIGHT COLUMN: Resumo do Pedido (OCULTO NA TELA DO PIX E CONCLUÍDO) */}
      {!isPixGenerated && activeStep !== 4 && (
        <aside className="columbia-side-col">
          <div className="columbia-summary-box">
            <h3 className="columbia-summary-title">Resumo do pedido</h3>

            {/* Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#7E8691', paddingBottom: 8, borderBottom: '1px solid #23272E' }}>
              <span>Produto</span>
              <span>Subtotal</span>
            </div>

            <div className="columbia-item-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/hero-mockup.webp"
                alt={kit}
                className="columbia-item-img"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="columbia-item-meta">
                <b>{kit}</b>
                <small>{marca} {modelo} ({ano}) &bull; {cor}</small>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: '#A9B0BA' }}>Qtd: 1</span>
                </div>
              </div>
              <div className="columbia-item-price">
                {formatMoney(amount)}
              </div>
            </div>

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
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0D' }}>
      {/* Top Header - Dark Luxury */}
      <header className="columbia-co-hd">
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/logo.png"
                alt="AlfaCarbon"
                style={{ height: 26, width: 'auto' }}
              />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div className="columbia-secure-tag">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#19C25A" strokeWidth="2.4">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>100% Seguro</span>
            </div>

            <Link
              href="/"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid #282E38',
                color: '#CBD5E1',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                flexShrink: 0,
              }}
              aria-label="Voltar para a Loja"
            >
              ✕
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="columbia-co-body">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px 0', color: '#A9B0BA' }}>Carregando dados do pedido...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>

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
