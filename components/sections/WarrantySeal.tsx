'use client';

import React from 'react';

export default function WarrantySeal() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="warr">
          <div className="warr-seal">
            <div>
              <b>12</b>
              <small>Meses</small>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
              Garantia de 12 meses e 7 dias incondicionais para testar no seu carro
            </h2>
            <p>
              Oferecemos 12 meses de cobertura total contra qualquer defeito de fabricação. Além disso,
              garantimos 7 dias corridos após o recebimento para você testar os tapetes no seu carro
              (conforme o Artigo 49 do Código de Defesa do Consumidor). Se o encaixe não for milimétrico
              ou você simplesmente não ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas
              ou burocracia. O custo do frete de devolução é por nossa conta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
