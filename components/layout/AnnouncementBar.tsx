'use client';

import React, { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const STORAGE_KEY = 'tapecarbon_br_deadline';
    let end = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (!end || end < Date.now()) {
      end = Date.now() + 24 * 3600 * 1000;
      try {
        localStorage.setItem(STORAGE_KEY, String(end));
      } catch {}
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    const update = () => {
      let diff = end - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const d = Math.floor(diff / 864e5);
      diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);
      diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);
      diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);

      setTimeLeft(`${pad(h + d * 24)}:${pad(m)}:${pad(s)}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="announce" id="announce">
      <div className="wrap">
        <span className="an-live" aria-hidden="true"></span>
        <span className="an-msg" id="an-msg">
          Seu <b>-51%</b> e o <b>frete grátis</b> terminam em
        </span>
        <time className="an-clock" id="clock-top">{timeLeft}</time>
      </div>
    </div>
  );
}
