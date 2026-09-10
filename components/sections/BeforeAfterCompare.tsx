'use client';

import React, { useState, useRef, useCallback } from 'react';

interface CompareBoxProps {
  imgBefore: string;
  imgAfter: string;
  altBefore: string;
  altAfter: string;
  caption: string;
}

function CompareBox({ imgBefore, imgAfter, altBefore, altAfter, caption }: CompareBoxProps) {
  const [pos, setPos] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos(prev => Math.max(0, prev - 5));
    if (e.key === 'ArrowRight') setPos(prev => Math.min(100, prev + 5));
  };

  return (
    <div>
      <div
        className="cmp"
        ref={containerRef}
        style={{ '--pos': `${pos}%` } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Comparar antes e depois"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="a" src={imgBefore} width="1100" height="733" loading="lazy" alt={altBefore} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="b" src={imgAfter} width="1100" height="733" loading="lazy" alt={altAfter} />
        <span className="tag tag-a">Antes</span>
        <span className="tag tag-b">Depois</span>
        <span className="bar" aria-hidden="true"></span>
      </div>
      <p className="cmp-cap">{caption}</p>
    </div>
  );
}

export default function BeforeAfterCompare() {
  return (
    <section className="sec sec-dark">
      <div className="wrap">
        <div className="sec-head mid">
          <span className="kicker">Antes e depois</span>
          <h2>O mesmo carro, com e sem o tapete bandeja 3D</h2>
          <p>Arraste a barra para comparar o piso original e com o kit instalado.</p>
        </div>

        <div className="cols c2">
          <CompareBox
            imgBefore="/assets/img/antes-frente.webp"
            imgAfter="/assets/img/despues-frente.webp"
            altBefore="Piso dianteiro original sujo e manchado"
            altAfter="Piso dianteiro com tapete bandeja 3D TapeCarbon instalado"
            caption="Piso dianteiro — motorista e passageiro."
          />

          <CompareBox
            imgBefore="/assets/img/antes-trasero.webp"
            imgAfter="/assets/img/despues-trasero.webp"
            altBefore="Piso traseiro de fábrica desgastado e com areia"
            altAfter="Piso traseiro com tapete bandeja 3D inteiriço protegendo o túnel"
            caption="Piso traseiro — uma só peça com túnel central protegido."
          />
        </div>
      </div>
    </section>
  );
}
