'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney, formatInstallment } from '@/data/config';
import {
  VEHICLE_BRANDS,
  getModelsForBrand,
  getYearsForModel,
  searchVehicles,
  SearchIndexItem
} from '@/data/vehicles';
import TextureZoomModal from '@/components/product/TextureZoomModal';

const OPT_CUSTOM_BRAND = '__outra_marca__';
const OPT_CUSTOM_MODEL = '__outro_modelo__';

export default function ProductConfigurator() {
  const {
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
    textureId,
    setTextureId,
    selectedKit,
    selectedColor,
    selectedTexture,
    addToCart,
    formattedVehicle
  } = useStore();

  const [activeShotIndex, setActiveShotIndex] = useState(0);

  // Quick vehicle search
  const [quickSearch, setQuickSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchIndexItem[]>([]);
  const [showSearchList, setShowSearchList] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  // Filter inside dropdowns
  const [brandFilter, setBrandFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');

  // Custom free-text vehicle inputs
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customBrandText, setCustomBrandText] = useState('');
  const [customModelText, setCustomModelText] = useState('');

  // Texture Lightbox Zoom Modal
  const [zoomTexture, setZoomTexture] = useState<{
    name: string;
    image: string;
    description: string;
  } | null>(null);

  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setOpenBrand(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setOpenModel(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setOpenYear(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchList(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search input handler
  useEffect(() => {
    if (!quickSearch.trim()) {
      setSearchResults([]);
      setShowSearchList(false);
      return;
    }
    const res = searchVehicles(quickSearch, 7);
    setSearchResults(res);
    setShowSearchList(true);
  }, [quickSearch]);

  // Filtered brands list
  const filteredBrands = useMemo(() => {
    const q = brandFilter.trim().toLowerCase();
    const all = VEHICLE_BRANDS;
    const list = q ? all.filter(b => b.toLowerCase().includes(q)) : all;
    return list;
  }, [brandFilter]);

  // Filtered models list
  const availableModels = useMemo(() => {
    if (!brand || isCustomBrand) return [];
    return getModelsForBrand(brand);
  }, [brand, isCustomBrand]);

  const filteredModels = useMemo(() => {
    const q = modelFilter.trim().toLowerCase();
    return q ? availableModels.filter(m => m.toLowerCase().includes(q)) : availableModels;
  }, [availableModels, modelFilter]);

  // Available years list
  const availableYears = useMemo(() => {
    if (!brand || !model) return [];
    return getYearsForModel(brand, model);
  }, [brand, model]);

  // Quick search selection
  const handleSelectQuickSearch = (item: SearchIndexItem) => {
    setQuickSearch(`${item.marca} ${item.modelo}`);
    setShowSearchList(false);
    setIsCustomBrand(false);
    setIsCustomModel(false);
    setBrand(item.marca);
    setModel(item.modelo);
    setYear(null);
    setOpenYear(true);
  };

  // Gallery shots
  interface GalleryShot {
    src: string;
    alt: string;
    contain?: boolean;
  }

  const mainKitImage = `/assets/img/kit-${kitId === 'carro_com' ? 'full' : 'interior'}-${colorId === 'preto' ? 'negro' : colorId === 'cinza' ? 'gris' : 'beige'}.webp`;
  const extraShots: GalleryShot[] = [
    { src: '/assets/img/interior-instalado.webp', alt: 'Interior completo com jogo de tapetes 3D instalado' },
    { src: '/images/foto3.jpg', alt: 'Textura e acabamento de perto' },
    { src: '/assets/img/detalle-cobertura.webp',  alt: 'Cobertura completa do piso dianteiro e traseiro' },
    { src: '/assets/img/ojal-fijacion.webp',      alt: 'Ilhós do tapete travado no pino original do carro' },
    { src: '/assets/img/detalle-puerta.webp',     alt: 'Encaixe do tapete contra a soleira da porta' }
  ];

  const allShots: GalleryShot[] = [
    { src: mainKitImage, alt: `${selectedKit.name} na cor ${selectedColor.name}`, contain: true },
    ...extraShots
  ];

  const currentShot = allShots[Math.min(activeShotIndex, allShots.length - 1)];
  const discountPercent = Math.round((1 - selectedKit.price / selectedKit.priceOld) * 100);

  return (
    <section className="product" id="producto">
      <div className="wrap">
        <div className="product-grid">

          {/* Galeria */}
          <div className="gallery">
            <div className="gal-main">
              <span className="gal-flag" id="gal-flag">-{discountPercent}% OFF</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="gal-img"
                className={currentShot.contain ? 'contain' : ''}
                src={currentShot.src}
                alt={currentShot.alt}
                width="800"
                height="817"
              />
            </div>

            <div className="gal-thumbs" id="gal-thumbs">
              {allShots.map((shot, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={idx === activeShotIndex ? 'on' : ''}
                  onClick={() => setActiveShotIndex(idx)}
                  aria-label={`Ver imagem ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Configurador / Compra */}
          <div className="buy">
            <h2 className="buy-title">Tapetes automotivos sob medida tipo bandeja 3D</h2>
            <p className="buy-sub">
              Encaixe perfeito para o seu modelo, acabamento premium e proteção total contra água, barro e desgaste.
            </p>

            <div className="rating">
              <span className="stars" aria-hidden="true">★★★★★</span>
              <span>
                <b>4,9</b> de 5 · <a href="#opiniones">1.284 avaliações</a>
              </span>
            </div>

            <div className="pricebox">
              <div className="price-line">
                <span className="price-now" id="p-now">{formatMoney(selectedKit.price)}</span>
                <s className="price-was" id="p-was">{formatMoney(selectedKit.priceOld)}</s>
                <span className="price-off" id="p-off">-{discountPercent}% OFF</span>
              </div>
              <p className="price-note">
                ou <b id="p-cuota">{formatInstallment(selectedKit.price)}</b> · Frete Grátis com rastreio para todo o Brasil
              </p>
            </div>

            {/* Seletor de Veículo Inteligente */}
            <div className="picker" id="picker">
              <div className="picker-head">
                <h2>Qual é o seu veículo?</h2>
                <span>Fabricado sob medida para qualquer modelo</span>
              </div>

              {/* Busca Rápida Autocomplete */}
              <div className="vsearch-box mb-4 relative" ref={searchRef}>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Busca rápida do seu carro
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onFocus={() => { if (quickSearch.trim()) setShowSearchList(true); }}
                    placeholder="🔍 Digite o modelo (ex: Onix, HB20, Strada, Hilux...)"
                    className="w-full bg-[#1e2229] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  {quickSearch && (
                    <button
                      type="button"
                      onClick={() => { setQuickSearch(''); setShowSearchList(false); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Dropdown de resultados da busca */}
                {showSearchList && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#1a1d24] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-white/5">
                    {searchResults.map((item, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleSelectQuickSearch(item)}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between text-sm transition-colors"
                      >
                        <span className="font-bold text-white">{item.modelo}</span>
                        <span className="text-xs text-gray-400 font-medium">{item.marca}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearchList(false);
                        setIsCustomBrand(true);
                        setIsCustomModel(true);
                        setBrand(quickSearch || 'Outra Marca');
                        setModel(quickSearch || 'Modelo Personalizado');
                      }}
                      className="w-full text-left px-4 py-3 bg-red-950/30 hover:bg-red-900/40 text-xs font-semibold text-red-400 flex items-center gap-2 transition-colors"
                    >
                      <span>🔍 Não encontrou seu modelo? Toque para digitar (fazemos sob medida ✅)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Seletores Tradicionais (Marca, Modelo, Ano) */}
              <div className="fields">
                {/* Marca */}
                <div className="f" ref={brandRef}>
                  <label id="l-brand">Marca</label>
                  <div className={`sel ${openBrand ? 'open' : ''} ${brand ? 'set' : ''}`}>
                    <button
                      type="button"
                      className={`sel-btn ${!brand ? 'ph' : ''}`}
                      onClick={() => {
                        setOpenBrand(!openBrand);
                        setOpenModel(false);
                        setOpenYear(false);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={openBrand}
                    >
                      <span>{brand || 'Escolha a marca'}</span>
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openBrand && (
                      <div className="sel-pop">
                        <input
                          className="sel-search"
                          type="text"
                          placeholder="Buscar marca…"
                          value={brandFilter}
                          onChange={e => setBrandFilter(e.target.value)}
                          autoFocus
                        />
                        <ul className="sel-list" role="listbox">
                          {filteredBrands.map(b => (
                            <li
                              key={b}
                              role="option"
                              aria-selected={brand === b}
                              onClick={() => {
                                setBrand(b);
                                setModel(null);
                                setYear(null);
                                setIsCustomBrand(false);
                                setIsCustomModel(false);
                                setOpenBrand(false);
                                setBrandFilter('');
                                setOpenModel(true);
                              }}
                            >
                              {b}
                            </li>
                          ))}
                          <li
                            className="text-red-400 font-semibold border-t border-white/10 mt-1 pt-1"
                            onClick={() => {
                              setIsCustomBrand(true);
                              setIsCustomModel(true);
                              setOpenBrand(false);
                            }}
                          >
                            ✚ Outra marca (digitar)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modelo */}
                <div className="f" ref={modelRef}>
                  <label id="l-model">Modelo</label>
                  <div className={`sel ${openModel ? 'open' : ''} ${model ? 'set' : ''}`}>
                    <button
                      type="button"
                      className={`sel-btn ${!model ? 'ph' : ''}`}
                      disabled={!brand && !isCustomBrand}
                      onClick={() => {
                        setOpenModel(!openModel);
                        setOpenBrand(false);
                        setOpenYear(false);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={openModel}
                    >
                      <span>{model || (brand ? 'Escolha o modelo' : 'Escolha a marca')}</span>
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openModel && (
                      <div className="sel-pop">
                        <input
                          className="sel-search"
                          type="text"
                          placeholder="Buscar modelo…"
                          value={modelFilter}
                          onChange={e => setModelFilter(e.target.value)}
                          autoFocus
                        />
                        <ul className="sel-list" role="listbox">
                          {filteredModels.map(m => (
                            <li
                              key={m}
                              role="option"
                              aria-selected={model === m}
                              onClick={() => {
                                setModel(m);
                                setYear(null);
                                setIsCustomModel(false);
                                setOpenModel(false);
                                setModelFilter('');
                                setOpenYear(true);
                              }}
                            >
                              {m}
                            </li>
                          ))}
                          <li
                            className="text-red-400 font-semibold border-t border-white/10 mt-1 pt-1"
                            onClick={() => {
                              setIsCustomModel(true);
                              setOpenModel(false);
                            }}
                          >
                            🔍 Não encontrei meu modelo (digitar)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ano */}
                <div className="f f-year" ref={yearRef}>
                  <label id="l-year">Ano</label>
                  <div className={`sel ${openYear ? 'open' : ''} ${year ? 'set' : ''}`}>
                    <button
                      type="button"
                      className={`sel-btn ${!year ? 'ph' : ''}`}
                      disabled={!model && !isCustomModel}
                      onClick={() => {
                        setOpenYear(!openYear);
                        setOpenBrand(false);
                        setOpenModel(false);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={openYear}
                    >
                      <span>{year || 'Ano'}</span>
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openYear && (
                      <div className="sel-pop">
                        <ul className="sel-list" role="listbox">
                          {(availableYears.length > 0 ? availableYears : ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010']).map(y => (
                            <li
                              key={y}
                              role="option"
                              aria-selected={year === y}
                              onClick={() => {
                                setYear(y);
                                setOpenYear(false);
                              }}
                            >
                              {y}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos livres se o usuário selecionou digitar */}
              {isCustomBrand && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Digite a marca do seu veículo:
                  </label>
                  <input
                    type="text"
                    value={customBrandText}
                    onChange={(e) => {
                      setCustomBrandText(e.target.value);
                      setBrand(e.target.value);
                    }}
                    placeholder="Ex: Effa, Lifan, Iveco..."
                    className="w-full bg-[#1e2229] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {isCustomModel && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Digite o modelo do seu veículo:
                  </label>
                  <input
                    type="text"
                    value={customModelText}
                    onChange={(e) => {
                      setCustomModelText(e.target.value);
                      setModel(e.target.value);
                    }}
                    placeholder="Ex: Doblò Adventure 1.8, Santana 2000..."
                    className="w-full bg-[#1e2229] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Pode escrever do seu jeito — fabricamos sob medida para qualquer modelo. ✅
                  </p>
                </div>
              )}

              {/* Status do Encaixe */}
              <p className={`fit ${formattedVehicle ? 'ok' : ''}`} id="fit" role="status">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                  {formattedVehicle ? (
                    <>Molde 3D calibrado e disponível para <b>{formattedVehicle}</b>. Estoque confirmado!</>
                  ) : (
                    <>Preencha os campos para confirmarmos o molde do seu veículo.</>
                  )}
                </span>
              </p>
            </div>

            {/* Kits */}
            <div className="opt">
              <h2>Escolha seu Kit</h2>
              <div className="kits">
                {CONFIG.kits.map(k => (
                  <button
                    type="button"
                    key={k.id}
                    className={`kit ${k.id === kitId ? 'on' : ''}`}
                    onClick={() => {
                      setKitId(k.id);
                      setActiveShotIndex(0);
                    }}
                    aria-pressed={k.id === kitId}
                  >
                    {k.tag && <span className="flag">{k.tag}</span>}
                    <span className="dot" aria-hidden="true"></span>
                    <span>
                      <b>{k.name}</b>
                      <small>{k.sub}</small>
                    </span>
                    <span className="kp">
                      <b>{formatMoney(k.price)}</b>
                      <br />
                      <s>{formatMoney(k.priceOld)}</s>
                    </span>
                  </button>
                ))}
              </div>

              <ul className="incl">
                {selectedKit.features.map((f, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cores */}
            <div className="opt">
              <h2>Cor <span id="color-name">— {selectedColor.name}</span></h2>
              <div className="chips">
                {CONFIG.colors.map(c => (
                  <button
                    type="button"
                    key={c.id}
                    className={`chip ${c.id === colorId ? 'on' : ''}`}
                    onClick={() => {
                      setColorId(c.id);
                      setActiveShotIndex(0);
                    }}
                    aria-pressed={c.id === colorId}
                  >
                    <i style={{ background: c.hex }}></i>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Texturas do Carpete (Replicado da Rodalux) */}
            <div className="opt">
              <h2>Textura do Carpete <span id="texture-name">— {selectedTexture.name}</span></h2>
              <p className="text-xs text-gray-400 mb-3">
                Garante o padrão exato de acabamento e aderência que você deseja.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {CONFIG.textures.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTextureId(t.id)}
                    className={`relative rounded-xl border p-2.5 cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${
                      t.id === textureId
                        ? 'border-red-500 bg-red-950/20 shadow-md ring-1 ring-red-500'
                        : 'border-white/10 bg-[#1a1d24] hover:border-white/25'
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                      {t.id === textureId && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white mb-1.5">{t.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomTexture(t);
                      }}
                      className="text-[11px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded w-full transition-colors"
                    >
                      🔍 Ver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Compra */}
            <button className="btn btn-buy btn-lg mt-4" onClick={addToCart}>
              Montar meu kit agora
            </button>
            <p className="stockline">Restam apenas {CONFIG.stockUnits} unidades a este preço promocional</p>

            <ul className="assur">
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Frete grátis</b> com código de rastreamento enviado por e-mail e WhatsApp.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Satisfação Garantida ou seu dinheiro de volta</b> em até 7 dias após o recebimento.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>12 meses de garantia</b> contra defeitos de fabricação ou desgaste anormal.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lightbox de Zoom de Textura */}
      <TextureZoomModal
        isOpen={!!zoomTexture}
        onClose={() => setZoomTexture(null)}
        texture={zoomTexture}
      />
    </section>
  );
}
