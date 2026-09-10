'use client'

import { useState, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  brand: string
  model: string
  year: number
  kit: string
  price: number | null
  quantity: number
  imageSlot: string // slot name for the product image
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
}

const STORAGE_KEY = 'tapecarbon_cart'

function loadCart(): CartStore {
  if (typeof window === 'undefined') return { items: [], isOpen: false }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { items: parsed.items || [], isOpen: false }
    }
  } catch {
    // ignore parse errors
  }
  return { items: [], isOpen: false }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }))
  } catch {
    // ignore storage errors
  }
}

export function useCart() {
  const [cart, setCart] = useState<CartStore>(() => loadCart())

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'quantity'>) => {
    setCart(prev => {
      const id = `${item.brand}-${item.model}-${item.year}-${item.kit}`
      const existing = prev.items.find(i => i.id === id)
      let newItems: CartItem[]

      if (existing) {
        newItems = prev.items.map(i =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...prev.items, { ...item, id, quantity: 1 }]
      }

      saveCart(newItems)
      return { items: newItems, isOpen: true }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(i => i.id !== id)
      saveCart(newItems)
      return { ...prev, items: newItems }
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart(prev => {
      const newItems = quantity <= 0
        ? prev.items.filter(i => i.id !== id)
        : prev.items.map(i => i.id === id ? { ...i, quantity } : i)
      saveCart(newItems)
      return { ...prev, items: newItems }
    })
  }, [])

  const openCart = useCallback(() => {
    setCart(prev => ({ ...prev, isOpen: true }))
  }, [])

  const closeCart = useCallback(() => {
    setCart(prev => ({ ...prev, isOpen: false }))
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setCart({ items: [], isOpen: false })
  }, [])

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price ? item.price * item.quantity : 0)
  }, 0)

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
    clearCart,
  }
}
