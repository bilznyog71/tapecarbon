'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { CONFIG, formatMoney, formatInstallment } from '@/data/config';

const BRAZILIAN_VEHICLES: Record<string, string[]> = {
  'Chevrolet': ['Onix', 'Onix Plus', 'Tracker', 'Cruze', 'Spin', 'S10', 'Montana', 'Prisma', 'Cobalt', 'Equinox', 'Joy', 'Trailblazer'],
  'Volkswagen': ['Polo', 'Gol', 'T-Cross', 'Nivus', 'Virtus', 'Taos', 'Saveiro', 'Amarok', 'Voyage', 'Fox', 'Up!', 'Jetta', 'Tiguan'],
  'Fiat': ['Strada', 'Toro', 'Mobi', 'Argo', 'Cronos', 'Pulse', 'Fastback', 'Fiorino', 'Palio', 'Uno', 'Siena', 'Titano', 'Idea', 'Punto'],
  'Toyota': ['Corolla', 'Corolla Cross', 'Hilux', 'Yaris', 'Yaris Sedan', 'Etios', 'Etios Sedan', 'SW4', 'RAV4'],
  'Hyundai': ['HB20', 'HB20S', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Elantra', 'ix35'],
  'Jeep': ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee'],
  'Renault': ['Kwid', 'Duster', 'Sandero', 'Logan', 'Kardian', 'Oroch', 'Captur', 'Stepway', 'Master', 'Fluence'],
  'Honda': ['Civic', 'HR-V', 'City', 'City Hatch', 'Fit', 'WR-V', 'CR-V', 'ZR-V'],
  'Nissan': ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Tiida'],
  'BYD': ['Dolphin', 'Dolphin Mini', 'Song Plus', 'Yuan Plus', 'Seal', 'King', 'Shark'],
  'Caoa Chery': ['Tiggo 5X', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Tiggo 2', 'Tiggo 3X', 'Arrizo 6'],
  'Ford': ['Ranger', 'Ka', 'Ka Sedan', 'EcoSport', 'Territory', 'Maverick', 'Bronco Sport', 'Fiesta', 'Focus', 'Fusion'],
  'Peugeot': ['208', '2008', '3008', 'Partner'],
  'Citroën': ['C3', 'C3 Aircross', 'C4 Cactus', 'Basalt', 'C4 Lounge', 'Aircross'],
  'BMW': ['Série 3 (320i)', 'X1', 'X3', 'X5', 'Série 1 (118i/120i)', 'Série 2', 'X4', 'X6'],
  'Audi': ['A3 Sedan', 'A3 Sportback', 'A4', 'Q3', 'Q5', 'A5'],
  'Mercedes-Benz': ['Classe C', 'GLA', 'GLB', 'GLC', 'Classe A', 'CLA'],
  'Mitsubishi': ['L200 Triton', 'ASX', 'Eclipse Cross', 'Outlander', 'Pajero Dakar'],
  'Outra Marca': ['Não encontro meu modelo na lista']
};

const YEARS_LIST: string[] = (() => {
  const list: string[] = [];
  for (let y = 2026; y >= 2010; y--) list.push(String(y));
  return list;
})();

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
    selectedKit,
    selectedColor,
    addToCart,
    formattedVehicle
  } = useStore();

  const [activeShotIndex, setActiveShotIndex] = useState(0);

  // Dropdown states
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  // Search filters
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setOpenBrand(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setOpenModel(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setOpenYear(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    const all = Object.keys(BRAZILIAN_VEHICLES);
    return q ? all.filter(b => b.toLowerCase().includes(q)) : all;
  }, [brandSearch]);

  // Filtered models
  const filteredModels = useMemo(() => {
    if (!brand || !BRAZILIAN_VEHICLES[brand]) return [];
    const q = modelSearch.trim().toLowerCase();
    const all = BRAZILIAN_VEHICLES[brand];
    return q ? all.filter(m => m.toLowerCase().includes(q)) : all;
  }, [brand, modelSearch]);

  // Gallery shots
  interface GalleryShot {
    src: string;
    alt: string;
    contain?: boolean;
  }

  const mainKitImage = `/assets/img/kit-${kitId}-${colorId}.webp`;
  const extraShots: GalleryShot[] = [
    { src: '/assets/img/interior-instalado.webp', alt: 'Interior completo com jogo de tapetes 3D instalado' },
    { src: '/assets/img/detalle-cobertura.webp',  alt: 'Cobertura completa do piso dianteiro e traseiro' },
    { src: '/assets/img/ojal-fijacion.webp',      alt: 'Ilhós do tapete travado no pino original do carro' },
    { src: '/assets/img/detalle-puerta.webp',     alt: 'Encaixe do tapete contra a soleira da porta' },
    { src: '/assets/img/ambiente-frente.webp',    alt: 'Tapete colocado no piso do motorista' }
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
            <h2 className="buy-title">Tapete bandeja 3D sob medida para o seu carro</h2>
            <p className="buy-sub">
              TPE injetado de alta densidade, borda elevada de até 3 cm e molde exclusivo da sua marca, modelo e ano.
            </p>

            <div className="rating">
              <span className="stars" aria-hidden="true">★★★★★</span>
              <span>
                <b>{CONFIG.ratingAvg.toString().replace('.', ',')}</b> · <a href="#opiniones">{CONFIG.reviewCount} avaliações</a>
              </span>
            </div>

            <div className="pricebox">
              <div className="price-line">
                <span className="price-now" id="p-now">{formatMoney(selectedKit.price)}</span>
                <s className="price-was" id="p-was">{formatMoney(selectedKit.priceOld)}</s>
                <span className="price-off" id="p-off">-{discountPercent}%</span>
              </div>
              <p className="price-note">
                ou <b id="p-cuota">{formatInstallment(selectedKit.price)}</b> · Frete grátis para todo o Brasil
              </p>
            </div>

            {/* Seletor de Veículo */}
            <div className="picker" id="picker">
              <div className="picker-head">
                <h2>Qual é o seu veículo?</h2>
                <span>Fabricamos no molde exato</span>
              </div>

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
                          value={brandSearch}
                          onChange={e => setBrandSearch(e.target.value)}
                          autoFocus
                        />
                        <ul className="sel-list" role="listbox">
                          {filteredBrands.length > 0 ? (
                            filteredBrands.map(b => (
                              <li
                                key={b}
                                role="option"
                                aria-selected={brand === b}
                                onClick={() => {
                                  setBrand(b);
                                  setModel(null);
                                  setYear(null);
                                  setOpenBrand(false);
                                  setBrandSearch('');
                                  setOpenModel(true);
                                }}
                              >
                                {b}
                              </li>
                            ))
                          ) : (
                            <li className="none">Nenhuma marca encontrada</li>
                          )}
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
                      disabled={!brand}
                      onClick={() => {
                        setOpenModel(!openModel);
                        setOpenBrand(false);
                        setOpenYear(false);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={openModel}
                    >
                      <span>{model || (brand ? 'Escolha o modelo' : 'Escolha a marca primeiro')}</span>
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openModel && brand && (
                      <div className="sel-pop">
                        <input
                          className="sel-search"
                          type="text"
                          placeholder="Buscar modelo…"
                          value={modelSearch}
                          onChange={e => setModelSearch(e.target.value)}
                          autoFocus
                        />
                        <ul className="sel-list" role="listbox">
                          {filteredModels.length > 0 ? (
                            filteredModels.map(m => (
                              <li
                                key={m}
                                role="option"
                                aria-selected={model === m}
                                onClick={() => {
                                  setModel(m);
                                  setYear(null);
                                  setOpenModel(false);
                                  setModelSearch('');
                                  setOpenYear(true);
                                }}
                              >
                                {m}
                              </li>
                            ))
                          ) : (
                            <li className="none">Nenhum modelo encontrado</li>
                          )}
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
                      disabled={!model}
                      onClick={() => {
                        setOpenYear(!openYear);
                        setOpenBrand(false);
                        setOpenModel(false);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={openYear}
                    >
                      <span>{year || (model ? 'Escolha o ano' : 'Escolha o modelo primeiro')}</span>
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openYear && model && (
                      <div className="sel-pop">
                        <ul className="sel-list" role="listbox">
                          {YEARS_LIST.map(y => (
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

              {/* Status do Encaixe */}
              <p className={`fit ${formattedVehicle ? 'ok' : ''}`} id="fit" role="status">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                  {formattedVehicle ? (
                    <>Molde 3D calibrado e disponível para <b>{formattedVehicle}</b>.</>
                  ) : (
                    <>
                      Preencha os três campos para confirmarmos o molde do seu veículo.{' '}
                      <a
                        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, não encontrei meu modelo na lista. Podem verificar a compatibilidade?')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Não encontrou seu modelo?
                      </a>
                    </>
                  )}
                </span>
              </p>
            </div>

            {/* Kits */}
            <div className="opt">
              <h2>Kit</h2>
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

            {/* Brinde */}
            <div className="gift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/llavero.webp" alt="Chaveiro réplica" width="44" height="44" loading="lazy" />
              <div>
                <b>Chaveiro réplica de presente</b>
                <small>Miniatura em TPE do seu tapete, inclusa gratuitamente em qualquer kit.</small>
              </div>
            </div>

            {/* Botão de Compra */}
            <button className="btn btn-buy btn-lg" onClick={addToCart}>
              Adicionar ao pedido
            </button>
            <p className="stockline">Restam apenas {CONFIG.stockUnits} unidades a este preço promocional</p>

            <ul className="assur">
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Frete grátis</b> para todo o Brasil, sem valor mínimo de compra.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>7 dias para testar ou devolver.</b> Se não servir, devolvemos 100% do valor.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>12 meses de garantia</b> de fábrica contra qualquer defeito de fabricação.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
