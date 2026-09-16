'use client';

import React, { useEffect } from 'react';

interface TextureZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  texture: {
    name: string;
    image: string;
    description?: string;
  } | null;
}

export default function TextureZoomModal({ isOpen, onClose, texture }: TextureZoomModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !texture) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização da textura ${texture.name}`}
    >
      <div
        className="relative max-w-lg w-full bg-[#17191E] border border-white/10 rounded-2xl p-5 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-bold z-10"
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={texture.image}
            alt={texture.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">{texture.name}</h3>
          {texture.description && (
            <p className="text-sm text-gray-300 leading-relaxed">{texture.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
