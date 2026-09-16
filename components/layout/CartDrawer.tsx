'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney } from '@/data/config';

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, closeCart, openCheckout } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalOld = cart.reduce((sum, item) => sum + item.priceOld, 0);
  const totalDiscount = totalOld - total;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  return (
    <>
      <div className={`veil ${isCartOpen ? 'on' : ''}`} onClick={closeCart}></div>

      <aside
        className={`drw ${isCartOpen ? 'on' : ''}`}
        id="cart"
        role="dialog"
        aria-modal="true"
        aria-label="Seu pedido"
      >
        <div className="drw-hd">
          <h2>Seu pedido</h2>
          <button className="x" onClick={closeCart} aria-label="Fechar carrinho">✕</button>
        </div>

        <div className="drw-bd" id="cart-bd">
          {cart.length === 0 ? (
            <p className="empty">
              Você ainda não adicionou nenhum item.<br />
              Escolha seu veículo e monte seu kit.
            </p>
          ) : (
            <>
              {cart.map(item => (
                <div className="ci" key={item.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/img/kit-${item.kit}-${item.color}.webp`}
                    alt={item.kitName}
                    loading="lazy"
                  />
                  <div className="m">
                    <b>{item.kitName}</b>
                    <small>{item.vehicle}</small>
                    <small>Cor: {item.colorName}{item.textureName ? ` · ${item.textureName}` : ''}</small>
                    <button
                      className="rm"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                  <span className="p">{formatMoney(item.price)}</span>
                </div>
              ))}

              <button
                className="btn btn-line btn-lg"
                type="button"
                onClick={closeCart}
                style={{ marginTop: '6px' }}
              >
                Adicionar outro veículo
              </button>
            </>
          )}
        </div>

        <div className="drw-ft" id="cart-ft">
          {cart.length === 0 ? (
            <button className="btn btn-line btn-lg" onClick={closeCart}>
              Continuar navegando
            </button>
          ) : (
            <>
              <div className="tot">
                <span>Preço de tabela</span>
                <s>{formatMoney(totalOld)}</s>
              </div>
              <div className="tot">
                <span>Desconto</span>
                <span style={{ color: 'var(--green-dark)' }}>− {formatMoney(totalDiscount)}</span>
              </div>
              <div className="tot">
                <span>Frete</span>
                <span style={{ color: 'var(--green-dark)' }}>Grátis</span>
              </div>
              <div className="tot big">
                <span>Total</span>
                <b>{formatMoney(total)}</b>
              </div>

              <button className="btn btn-buy btn-lg" id="go" onClick={openCheckout}>
                Finalizar compra
              </button>

              <p style={{ fontSize: '12px', color: 'var(--ink-3)', textAlign: 'center', marginTop: '10px' }}>
                Pagamento 100% seguro &middot; Exclusivo via Pix com 5% OFF e aprovação imediata
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
