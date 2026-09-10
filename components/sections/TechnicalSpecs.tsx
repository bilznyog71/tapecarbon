'use client';

import React from 'react';
import { CONFIG } from '@/data/config';

export default function TechnicalSpecs() {
  const specs = [
    { label: 'Material', value: 'TPE (Elastômero Termoplástico) de alta densidade' },
    { label: 'Espessura', value: '6 mm de alta resistência' },
    { label: 'Borda perimétrica', value: 'Elevada, até 3 cm de contenção' },
    { label: 'Fixação', value: 'Ilhoses e travas originais de fábrica' },
    { label: 'Peças (kit interior)', value: '2 dianteiros + 1 traseiro em peça única (cobre o túnel)' },
    { label: 'Limpeza', value: 'Água e sabão neutro (lavável com mangueira)' },
    { label: 'Cores disponíveis', value: 'Preto, Cinza Grafite e Bege Areia' },
    { label: 'Garantia', value: '12 meses contra defeitos de fabricação' },
    { label: 'Frete', value: 'Grátis para todo o Brasil (com código de rastreamento)' },
  ];

  return (
    <section className="sec sec-soft">
      <div className="wrap">
        <div className="feat">
          <div className="feat-txt">
            <h2>Ficha técnica</h2>
            <p style={{ marginTop: '10px' }}>
              Os dados completos do produto, sem enrolação. Se você tiver qualquer dúvida específica
              sobre o seu modelo antes de comprar, nossa equipe técnica está à disposição.
            </p>
            <p style={{ marginTop: '16px' }}>
              <a
                className="btn btn-line"
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, gostaria de tirar uma dúvida técnica sobre os tapetes 3D.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Fazer uma consulta via WhatsApp
              </a>
            </p>
          </div>

          <table className="specs">
            <tbody>
              {specs.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.label}</td>
                  <td>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
