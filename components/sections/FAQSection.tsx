'use client';

import React from 'react';
import { FAQ_DATA } from '@/data/faq';

export default function FAQSection() {
  return (
    <section className="sec sec-soft" id="preguntas">
      <div className="wrap narrow">
        <div className="sec-head">
          <h2>Perguntas frequentes</h2>
        </div>

        <div className="faq">
          {FAQ_DATA.map((item, idx) => (
            <details key={idx} open={idx === 0}>
              <summary>{item.question}</summary>
              <p className="ans">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
