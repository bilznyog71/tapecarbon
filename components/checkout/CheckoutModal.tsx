'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney } from '@/data/config';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart } = useStore();

  const [step, setStep] = useState<'form' | 'pay' | 'result'>('form');
  const [payMethod, setPayMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

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

  const numeroInputRef = useRef<HTMLInputElement>(null);

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
          }, 100);
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

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !sobrenome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !cep.trim() || !rua.trim() || !numero.trim() || !cidade.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios marcados com *.');
      return;
    }
    setFormError('');
    setStep('pay');
  };

  const handleCompleteOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generated = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generated);
      setIsSubmitting(false);
      setStep('result');
      clearCart();
    }, 1200);
  };

  if (!isCheckoutOpen) return null;

  return (
    <section className="co" id="checkout" role="dialog" aria-modal="true" aria-label="Finalizar compra">
      <header className="co-hd">
        <div className="wrap">
          <span className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo.png" alt="AlfaCarbon" width="115" height="40" />
          </span>

          <ol className="co-steps">
            <li className={step === 'form' ? 'on' : 'done'}>
              <i>1</i>Seus dados
            </li>
            <li className={step === 'pay' ? 'on' : step === 'result' ? 'done' : ''}>
              <i>2</i>Pagamento
            </li>
            <li className={step === 'result' ? 'on' : ''}>
              <i>3</i>Concluído
            </li>
          </ol>

          <button className="x" onClick={closeCheckout} aria-label="Voltar à loja">✕</button>
        </div>
      </header>

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

      <div className="co-body">
        <div className="wrap co-grid">

          {/* Coluna Principal */}
          <div className="co-main">

            {/* Passo 1: Formulário e Endereço */}
            {step === 'form' && (
              <form className="co-form" onSubmit={handleContinueToPayment} noValidate>
                <h2>1. Seus dados de contato</h2>
                <div className="co-row">
                  <p className="fld">
                    <label htmlFor="f-nome">Nome *</label>
                    <input
                      id="f-nome"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Ex: João"
                      required
                    />
                  </p>
                  <p className="fld">
                    <label htmlFor="f-sobrenome">Sobrenome *</label>
                    <input
                      id="f-sobrenome"
                      value={sobrenome}
                      onChange={e => setSobrenome(e.target.value)}
                      placeholder="Ex: Silva"
                      required
                    />
                  </p>
                </div>

                <div className="co-row">
                  <p className="fld">
                    <label htmlFor="f-email">E-mail *</label>
                    <input
                      id="f-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      required
                    />
                    <small>Enviaremos a confirmação e o código de rastreio aqui.</small>
                  </p>
                  <p className="fld">
                    <label htmlFor="f-tel">WhatsApp / Celular *</label>
                    <input
                      id="f-tel"
                      type="tel"
                      value={telefone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </p>
                </div>

                <p className="fld">
                  <label htmlFor="f-cpf">CPF (exigido para emissão de Nota Fiscal) *</label>
                  <input
                    id="f-cpf"
                    value={cpf}
                    onChange={e => handleCpfChange(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                  <small>Exigido pela Receita Federal para emissão de Nota Fiscal Eletrônica.</small>
                </p>

                <h2 style={{ marginTop: '28px' }}>2. Endereço de entrega</h2>
                <div className="co-row">
                  <p className="fld">
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
                      <small style={{ color: 'var(--gold)' }}>Buscando CEP...</small>
                    ) : cepFeedback ? (
                      <small style={{ color: cepFeedback.startsWith('✓') ? 'var(--green-dark)' : 'var(--red)', fontWeight: 600 }}>
                        {cepFeedback}
                      </small>
                    ) : (
                      <small>Digite o CEP para buscar o endereço automaticamente.</small>
                    )}
                  </p>
                  <p className="fld">
                    <label htmlFor="f-cidade">Cidade *</label>
                    <input
                      id="f-cidade"
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                      placeholder="Sua cidade"
                      required
                    />
                  </p>
                </div>

                <div className="co-row">
                  <p className="fld co-w2" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="f-rua">Rua / Logradouro *</label>
                    <input
                      id="f-rua"
                      value={rua}
                      onChange={e => setRua(e.target.value)}
                      placeholder="Nome da sua rua ou avenida"
                      required
                    />
                  </p>
                </div>

                <div className="co-row">
                  <p className="fld">
                    <label htmlFor="f-numero">Número *</label>
                    <input
                      id="f-numero"
                      ref={numeroInputRef}
                      value={numero}
                      onChange={e => setNumero(e.target.value)}
                      placeholder="Ex: 123"
                      required
                    />
                  </p>
                  <p className="fld">
                    <label htmlFor="f-compl">Complemento / Apto <span>(opcional)</span></label>
                    <input
                      id="f-compl"
                      value={complemento}
                      onChange={e => setComplemento(e.target.value)}
                      placeholder="Apto 42, Bloco B"
                    />
                  </p>
                </div>

                <div className="co-row">
                  <p className="fld">
                    <label htmlFor="f-bairro">Bairro *</label>
                    <input
                      id="f-bairro"
                      value={bairro}
                      onChange={e => setBairro(e.target.value)}
                      placeholder="Seu bairro"
                      required
                    />
                  </p>
                  <p className="fld">
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
                  </p>
                </div>

                <p className="fld">
                  <label htmlFor="f-ref">Ponto de referência <span>(opcional)</span></label>
                  <input
                    id="f-ref"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    placeholder="Próximo à padaria, portão branco, etc."
                  />
                </p>

                {formError && (
                  <p className="co-err" role="alert">{formError}</p>
                )}

                <button className="btn btn-buy btn-lg" type="submit">
                  Continuar para o pagamento &rarr;
                </button>
              </form>
            )}

            {/* Passo 2: Pagamento */}
            {step === 'pay' && (
              <div className="co-pay">
                <button className="co-back" type="button" onClick={() => setStep('form')}>
                  &larr; Voltar e editar dados
                </button>

                <h2>Forma de pagamento</h2>
                <p className="co-note">
                  Ambiente seguro e criptografado. Seus dados financeiros trafegam direto para a processadora.
                </p>

                <div className="chips" style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className={`chip ${payMethod === 'pix' ? 'on' : ''}`}
                    onClick={() => setPayMethod('pix')}
                  >
                    <i style={{ background: '#00B84A' }}></i>
                    Pix (Aprovação Instantânea)
                  </button>
                  <button
                    type="button"
                    className={`chip ${payMethod === 'card' ? 'on' : ''}`}
                    onClick={() => setPayMethod('card')}
                  >
                    <i style={{ background: '#E8B10C' }}></i>
                    Cartão de Crédito (até 12x)
                  </button>
                  <button
                    type="button"
                    className={`chip ${payMethod === 'boleto' ? 'on' : ''}`}
                    onClick={() => setPayMethod('boleto')}
                  >
                    <i style={{ background: '#787E88' }}></i>
                    Boleto Bancário
                  </button>
                </div>

                {payMethod === 'pix' && (
                  <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--r)', border: '1px solid var(--line-strong)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--green-dark)', marginBottom: '8px' }}>Pague com Pix e garanta envio prioritário</h3>
                    <p style={{ fontSize: '14px', marginBottom: '18px', color: 'var(--ink-2)' }}>
                      A confirmação do Pix ocorre em poucos segundos. Escaneie o QR Code ou use a chave Copia e Cola:
                    </p>

                    <div style={{ background: '#fff', padding: '16px', display: 'inline-block', borderRadius: '10px', marginBottom: '16px' }}>
                      {/* QR Code Pix */}
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
                    </div>

                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                      <input
                        readOnly
                        value="00020126580014br.gov.bcb.pix0136alfacarbon-shop-pix-checkout-pagamento5204000053039865405247.005802BR5920ALFACARBON AUTOMOTIVO6009SAO PAULO62070503***6304ABCD"
                        style={{ width: '100%', padding: '10px', fontSize: '12px', textAlign: 'center', background: 'var(--bg-soft)', border: '1px solid var(--line)', color: 'var(--ink-2)', borderRadius: '6px', marginBottom: '10px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-line btn-lg"
                        style={{ fontSize: '14px', padding: '12px' }}
                        onClick={() => {
                          navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136alfacarbon-shop-pix-checkout-pagamento5204000053039865405247.005802BR5920ALFACARBON AUTOMOTIVO6009SAO PAULO62070503***6304ABCD');
                          setPixCopied(true);
                          setTimeout(() => setPixCopied(false), 3000);
                        }}
                      >
                        {pixCopied ? '✓ Código Pix Copiado com Sucesso!' : 'Copiar Código Pix (Copia e Cola)'}
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === 'card' && (
                  <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--r)', border: '1px solid var(--line-strong)' }}>
                    <div className="fld">
                      <label>Número do cartão</label>
                      <input placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className="fld">
                      <label>Nome impresso no cartão</label>
                      <input placeholder="Como está no cartão" />
                    </div>
                    <div className="co-row">
                      <div className="fld">
                        <label>Validade</label>
                        <input placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div className="fld">
                        <label>CVV</label>
                        <input placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <div className="fld">
                      <label>Parcelamento</label>
                      <select defaultValue="1">
                        <option value="1">1x de {formatMoney(total)} (sem juros)</option>
                        <option value="2">2x de {formatMoney(Math.ceil(total / 2))} (sem juros)</option>
                        <option value="3">3x de {formatMoney(Math.ceil(total / 3))} (sem juros)</option>
                        <option value="6">6x de {formatMoney(Math.ceil(total / 6))} (sem juros)</option>
                        <option value="12">12x de {formatMoney(Math.ceil(total / 12))} (sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {payMethod === 'boleto' && (
                  <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--r)', border: '1px solid var(--line-strong)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '8px' }}>Boleto Bancário</h3>
                    <p style={{ fontSize: '14px', color: 'var(--ink-2)' }}>
                      O boleto será gerado com vencimento em 3 dias úteis. Você pode pagar em qualquer banco, casa lotérica ou aplicativo bancário.
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-buy btn-lg"
                  style={{ marginTop: '24px' }}
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processando pedido seguro…' : `Confirmar Pedido · ${formatMoney(total)}`}
                </button>
              </div>
            )}

            {/* Passo 3: Concluído */}
            {step === 'result' && (
              <div className="co-result">
                <div className="ico ok">✓</div>
                <h2>Pedido Confirmado com Sucesso!</h2>
                <p>
                  Obrigado, <b>{nome}</b>! Seu pedido foi registrado em nossa loja oficial <b>alfacarbon.shop</b> e já foi encaminhado para a calibragem do molde 3D.
                </p>

                <span className="ref">
                  Código do Pedido: <b>#{orderId}</b>
                </span>

                <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--r)', border: '1px solid var(--line)', textAlign: 'left', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13.5px', marginBottom: '6px', color: 'var(--ink)' }}>
                    📍 <b>Endereço de entrega:</b> {rua}, {numero} {complemento ? `- ${complemento}` : ''}, {bairro}, {cidade} - {estado}, CEP {cep}
                  </p>
                  <p style={{ fontSize: '13.5px', marginBottom: '6px', color: 'var(--ink)' }}>
                    📦 <b>Envio:</b> Correios / Transportadora com código de rastreamento.
                  </p>
                  <p style={{ fontSize: '13.5px', margin: 0, color: 'var(--ink-2)' }}>
                    📧 Confirmação e Nota Fiscal enviadas para <b>{email}</b>.
                  </p>
                </div>

                <p>
                  <a
                    className="btn btn-buy"
                    href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Olá, realizei o pedido #${orderId} no site alfacarbon.shop e gostaria de acompanhar o envio.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acompanhar no WhatsApp
                  </a>
                  <button className="btn btn-line" onClick={closeCheckout}>
                    Voltar à loja
                  </button>
                </p>
              </div>
            )}

          </div>

          {/* Coluna Lateral: Resumo */}
          <aside className="co-side">
            <h2>Resumo do seu pedido</h2>

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

            <div className="mp-trust">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <b>Pagamento processado via Mercado Pago</b>
                <small>Seus dados bancários não passam pelo nosso servidor. Compra 100% blindada.</small>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
