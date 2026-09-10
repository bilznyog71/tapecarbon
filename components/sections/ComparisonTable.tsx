'use client';

import React from 'react';

export default function ComparisonTable() {
  const rows = [
    { feature: 'Molde 3D exato da sua marca, modelo e ano', tape: true, common: false },
    { feature: 'Borda elevada de contenção de até 3 cm', tape: true, common: false },
    { feature: '100% impermeável e à prova de derramamentos', tape: true, common: false },
    { feature: 'Encaixe nos ilhoses e pinos originais de fábrica', tape: true, common: false },
    { feature: 'Traseiro em peça única com proteção do túnel central', tape: true, common: false },
    { feature: 'TPE automotivo de alta densidade (6 mm real)', tape: true, common: false },
    { feature: '12 meses de garantia de fábrica', tape: true, common: false },
  ];

  return (
    <section className="sec sec-soft">
      <div className="wrap narrow">
        <div className="sec-head mid">
          <span className="kicker">A diferença</span>
          <h2>AlfaCarbon contra um tapete comum</h2>
        </div>

        <table className="vs">
          <thead>
            <tr>
              <th>Característica</th>
              <th>AlfaCarbon</th>
              <th>Tapete Comum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.feature}</td>
                <td className={r.tape ? 'si' : 'no'}>
                  {r.tape ? '✓' : '✕'}
                </td>
                <td className={r.common ? 'si' : 'no'}>
                  {r.common ? '✓' : '✕'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
