'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONFIG, Kit, ColorOption } from '@/data/config';

export interface CartItem {
  id: string;
  vehicle: string;
  kit: string;
  kitName: string;
  color: string;
  colorName: string;
  price: number;
  priceOld: number;
}

interface StoreContextType {
  brand: string | null;
  model: string | null;
  year: string | null;
  setBrand: (b: string | null) => void;
  setModel: (m: string | null) => void;
  setYear: (y: string | null) => void;

  kitId: string;
  setKitId: (k: string) => void;
  colorId: string;
  setColorId: (c: string) => void;

  selectedKit: Kit;
  selectedColor: ColorOption;

  cart: CartItem[];
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  formattedVehicle: string | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'tapecarbon_br_cart_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const [kitId, setKitId] = useState<string>(CONFIG.kits[0].id);
  const [colorId, setColorId] = useState<string>(CONFIG.colors[0].id);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const selectedKit = CONFIG.kits.find(k => k.id === kitId) || CONFIG.kits[0];
  const selectedColor = CONFIG.colors.find(c => c.id === colorId) || CONFIG.colors[0];

  const formattedVehicle = (brand && model && year) ? `${brand} ${model} ${year}` : null;

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Salvar carrinho no localStorage
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

  const addToCart = () => {
    if (!formattedVehicle) {
      const picker = document.getElementById('picker');
      if (picker) {
        picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const newItem: CartItem = {
      id: Math.random().toString(36).substring(2, 9),
      vehicle: formattedVehicle,
      kit: selectedKit.id,
      kitName: selectedKit.name,
      color: selectedColor.id,
      colorName: selectedColor.name,
      price: selectedKit.price,
      priceOld: selectedKit.priceOld,
    };

    const newCart = [...cart, newItem];
    updateCart(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const openCart = () => {
    setIsCheckoutOpen(false);
    setActiveModal(null);
    setIsCartOpen(true);
  };

  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setActiveModal(null);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  const openModal = (id: string) => {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setActiveModal(id);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <StoreContext.Provider
      value={{
        brand,
        model,
        year,
        setBrand,
        setModel,
        setYear,
        kitId,
        setKitId,
        colorId,
        setColorId,
        selectedKit,
        selectedColor,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        activeModal,
        openModal,
        closeModal,
        formattedVehicle,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
