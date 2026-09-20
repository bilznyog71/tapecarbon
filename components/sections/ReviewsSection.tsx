'use client';

import React, { useRef, useState } from 'react';
import { REVIEWS_DATA, ReviewItem } from '@/data/reviews';

function ReviewCard({ review, onPlay, activeVideoId }: { review: ReviewItem; onPlay: (id: string) => void; activeVideoId: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Sync if another video took over playing
  React.useEffect(() => {
    if (activeVideoId !== review.id && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [activeVideoId, review.id, isPlaying]);

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      onPlay(review.id);
      try {
        videoRef.current.muted = isMuted;
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {
        videoRef.current.muted = true;
        setIsMuted(true);
        await videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <article
      style={{
        background: 'var(--bg-light)',
        border: '1px solid var(--line-light)',
        borderRadius: 'var(--r-xl)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
    >
      {/* Top Header — sem "Cliente verificado" */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatar}
            alt={review.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--line-light-strong)', flexShrink: 0 }}
            loading="lazy"
          />
          <div>
            <strong style={{ color: 'var(--ink-lt)', fontSize: '14px', display: 'block', fontWeight: 700 }}>{review.name}</strong>
          </div>
        </div>

        {/* Stars */}
        <div style={{ color: 'var(--gold-2)', fontSize: '14px', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>★★★★★</div>

        {/* Text */}
        <p style={{ color: 'var(--ink-lt-2)', fontSize: '13.5px', lineHeight: 1.65, marginBottom: '16px' }}>
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Video Container */}
      <div
        style={{ position: 'relative', aspectRatio: '9/16', width: '100%', borderRadius: 'var(--r-l)', overflow: 'hidden', background: '#000', border: '1px solid var(--line-light)', cursor: 'pointer' }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
          preload="none"
          poster={review.poster}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={review.video} type="video/mp4" />
        </video>

        {/* Play Overlay */}
        {!isPlaying && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              type="button"
              style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', paddingLeft: '2px', boxShadow: '0 4px 20px rgba(24,184,84,0.4)', border: 0, cursor: 'pointer' }}
              aria-label="Reproduzir vídeo"
            >
              ▶
            </button>
          </div>
        )}

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          style={{ position: 'absolute', bottom: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', zIndex: 10 }}
          aria-label={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </article>
  );
}

export default function ReviewsSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleVideoPlay = (id: string) => {
    setActiveVideoId(id);
  };

  return (
    <section
      className="sec sec-light-soft"
      id="reviewsCarousel"
      style={{ borderTop: '1px solid var(--line-light)', borderBottom: '1px solid var(--line-light)' }}
    >
      <div className="wrap">
        <div className="sec-head mid">
          <span className="kicker">Clientes reais</span>
          <h2>Quem já instalou, aprovou.</h2>
          <p>
            Veja os vídeos de clientes que adquiriram e testaram no carro.
          </p>
        </div>

        {/* Video Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {REVIEWS_DATA.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onPlay={handleVideoPlay}
              activeVideoId={activeVideoId}
            />
          ))}
        </div>

        {/* Stats banner removido — dados não confirmados */}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #reviewsCarousel .grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          #reviewsCarousel .grid { grid-template-columns: 1fr !important; }
          #reviewsCarousel article { aspect-ratio: auto; }
        }
      `}</style>
    </section>
  );
}
