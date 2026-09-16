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
    <article className="bg-[#171a21] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3.5 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border border-white/15 shadow-sm"
            loading="lazy"
          />
          <div>
            <strong className="text-white text-base block font-bold leading-tight">{review.name}</strong>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              {review.name.includes('a') && !review.name.includes('Lucas') && !review.name.includes('Rafael') && !review.name.includes('Bruno') ? 'Cliente verificada' : 'Cliente verificado'}
            </span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5 text-amber-400 text-sm mb-2.5 font-bold">
          <span>★★★★★</span>
          <span className="text-white font-extrabold text-xs">5.0</span>
        </div>

        {/* Text */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Video Container */}
      <div
        className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 cursor-pointer group shadow-inner"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="none"
          poster={review.poster}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={review.video} type="video/mp4" />
        </video>

        {/* Play/Pause Overlay Button */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity">
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl pl-1 shadow-2xl hover:scale-110 transition-transform"
              aria-label="Reproduzir vídeo"
            >
              ▶
            </button>
          </div>
        )}

        {/* Mute/Unmute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs backdrop-blur-sm transition-colors border border-white/20 z-10"
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
    <section className="py-16 md:py-24 bg-[#0f1115] border-t border-b border-white/5" id="reviewsCarousel">
      <div className="wrap max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-block mb-3">
            Vídeos Reais de Clientes
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Avaliações de Clientes
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Veja o resultado e a opinião de quem já instalou no carro.
          </p>
        </div>

        {/* Video Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onPlay={handleVideoPlay}
              activeVideoId={activeVideoId}
            />
          ))}
        </div>

        {/* Footer Score Banner */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#171a21] border border-white/10 text-center flex flex-col items-center justify-center shadow-xl">
          <div className="text-amber-400 text-2xl tracking-widest mb-1">★★★★★</div>
          <div className="text-lg md:text-xl font-bold text-white mb-1.5">
            <strong className="text-white text-2xl font-black">4,9</strong> de 5 • 1.284 avaliações
          </div>
          <div className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-1.5">
            <span>Mais de 5.000 clientes satisfeitos em todo o Brasil</span>
            <span>🇧🇷</span>
          </div>
        </div>
      </div>
    </section>
  );
}
