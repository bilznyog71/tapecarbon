'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG } from '@/data/config';

export default function Modals() {
  const { activeModal, closeModal } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  return (
    <>
      <div className="veil on" onClick={closeModal}></div>

      {activeModal === 'empresa' && (
        <div className="mod on" role="dialog" aria-modal="true" aria-label="Quem somos">
          <div className="drw-hd">
            <h2>Quem somos</h2>
            <button className="x" onClick={closeModal} aria-label="Fechar">✕</button>
          </div>
          <div className="drw-bd">
            <p>
              A <b>{CONFIG.brand}</b> é especialista em desenvolvimento e comércio de tapetes automotivos bandeja 3D sob medida.
              Nossa tecnologia baseia-se em escaneamento tridimensional de cada assoalho, garantindo encaixe
              perfeito, bordas elevadas de contenção e proteção incomparável contra líquidos, terra e desgaste.
            </p>
            <p>
              Atendemos a todo o território brasileiro. Nosso compromisso inegociável é com a satisfação do cliente:
              se por qualquer razão o produto não corresponder às suas expectativas, nós resolvemos prontamente.
            </p>
            <h3>Canais Oficiais</h3>
            <p>
              E-mail: <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a><br />
              WhatsApp: <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">{CONFIG.whatsappLabel}</a><br />
              Horário de Atendimento: {CONFIG.hours}<br />
              Razão Social: {CONFIG.legalName}<br />
              CNPJ: {CONFIG.cnpj}
            </p>
          </div>
        </div>
      )}

      {activeModal === 'privacidade' && (
        <div className="mod on" role="dialog" aria-modal="true" aria-label="Política de privacidade">
          <div className="drw-hd">
            <h2>Política de privacidade</h2>
            <button className="x" onClick={closeModal} aria-label="Fechar">✕</button>
          </div>
          <div className="drw-bd">
            <p>
              A {CONFIG.brand} preza pela total segurança e confidencialidade dos seus dados, em conformidade com a
              <b> Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</b>.
            </p>
            <h3>Quais dados coletamos</h3>
            <p>
              Nome completo, e-mail, telefone/WhatsApp, endereço de entrega e CPF (exigido para emissão da Nota Fiscal
              e processamento bancário). Nunca coletamos dados desnecessários ou sensíveis.
            </p>
            <h3>Finalidade do uso</h3>
            <ul>
              <li>Processar, calibrar o molde e despachar seu pedido.</li>
              <li>Enviar o código de rastreamento em tempo real.</li>
              <li>Prestar suporte técnico, garantia e pós-venda.</li>
              <li>Cumprir obrigações fiscais perante a Receita Federal (NF-e).</li>
            </ul>
            <h3>Compartilhamento seguro</h3>
            <p>
              Não vendemos nem repassamos seus dados sob nenhuma hipótese. Os dados estritamente operacionais são compartilhados
              apenas com os Correios/transportadoras e com processadores de pagamento com criptografia SSL de ponta a ponta.
            </p>
          </div>
        </div>
      )}

      {activeModal === 'terminos' && (
        <div className="mod on" role="dialog" aria-modal="true" aria-label="Termos de uso">
          <div className="drw-hd">
            <h2>Termos de uso</h2>
            <button className="x" onClick={closeModal} aria-label="Fechar">✕</button>
          </div>
          <div className="drw-bd">
            <h3>Aceitação dos Termos</h3>
            <p>
              Ao navegar e efetuar compras em nossa loja, você concorda com as condições aqui estabelecidas
              e com a legislação brasileira aplicável, em especial a Lei nº 8.078/1990 (Código de Defesa do Consumidor).
            </p>
            <h3>Sobre os Produtos</h3>
            <p>
              Cada kit de tapetes é fabricado sob medida conforme a marca, modelo e ano indicados pelo comprador.
              As imagens exibidas são reais e de estúdio, podendo haver pequenas variações de textura ou brilho conforme o lote de injeção.
            </p>
            <h3>Preços e Pagamentos</h3>
            <p>
              Todos os preços estão expressos em Reais (R$) com tributos inclusos. O envio da mercadoria é condicionado
              à aprovação e liquidação do pagamento pela instituição financeira.
            </p>
          </div>
        </div>
      )}

      {activeModal === 'cambios' && (
        <div className="mod on" role="dialog" aria-modal="true" aria-label="Trocas e devoluções">
          <div className="drw-hd">
            <h2>Trocas e devoluções</h2>
            <button className="x" onClick={closeModal} aria-label="Fechar">✕</button>
          </div>
          <div className="drw-bd">
            <h3>Prazo de Arrependimento (Art. 49 CDC)</h3>
            <p>
              O Código de Defesa do Consumidor garante 7 dias corridos a partir do recebimento para arrependimento de compras online.
              Na {CONFIG.brand}, se o produto não servir ou você não gostar por qualquer motivo, nós garantimos a troca ou reembolso total.
            </p>
            <h3>Como Solicitar</h3>
            <p>
              Basta entrar em contato pelo WhatsApp <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">{CONFIG.whatsappLabel}</a> ou
              pelo e-mail <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a> com o número do seu pedido. Nossa equipe responderá em até 24 horas úteis.
            </p>
            <h3>Defeitos de Fabricação</h3>
            <p>
              Caso identifique qualquer anomalia ou defeito de fábrica dentro do período de 12 meses de garantia,
              nós arcaremos com todos os custos de frete e providenciaremos a substituição imediata da peça afetada.
            </p>
          </div>
        </div>
      )}

      {activeModal === 'envios' && (
        <div className="mod on" role="dialog" aria-modal="true" aria-label="Envíos e prazos">
          <div className="drw-hd">
            <h2>Prazos de envio e frete</h2>
            <button className="x" onClick={closeModal} aria-label="Fechar">✕</button>
          </div>
          <div className="drw-bd">
            <h3>Frete Grátis Nacional</h3>
            <p>
              Todas as compras contam com Frete 100% Grátis para qualquer cidade do Brasil, sem valor mínimo estipulado.
            </p>
            <h3>Prazos de Entrega</h3>
            <p>
              A entrega costuma ocorrer entre <b>2 e 5 dias úteis</b> para capitais e regiões metropolitanas das regiões Sul e Sudeste,
              e de <b>4 a 8 dias úteis</b> para demais estados brasileiros.
            </p>
            <h3>Rastreamento em Tempo Real</h3>
            <p>
              Assim que sua encomenda for postada, você receberá automaticamente o código de rastreio dos Correios ou da transportadora
              diretamente em seu WhatsApp e e-mail cadastrados.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
