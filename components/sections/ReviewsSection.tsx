'use client';

import React, { useRef, useState } from 'react';
import { REVIEWS_DATA, ReviewItem } from '@/data/reviews';

function ReviewCard({
  review,
  onPlay,
  activeVideoId,
}: {
  review: ReviewItem;
  onPlay: (id: string) => void;
  activeVideoId: string | null;
}) {
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
    <article className="rev-video-card">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatar}
            alt={review.name}
            className="w-11 h-11 rounded-full object-cover border border-white/15 shadow-sm flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <strong className="text-white text-sm font-bold block leading-tight truncate">
              {review.name}
            </strong>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              Cliente verificado
            </span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 text-[#E8B10C] text-sm mb-2 font-bold">
          <span>★★★★★</span>
          <span className="text-white font-extrabold text-xs ml-1">5.0</span>
        </div>

        {/* Text */}
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Video Container */}
      <div
        className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black/60 border border-white/10 cursor-pointer group shadow-inner"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          poster={review.poster}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={review.video} type="video/mp4" />
        </video>

        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity">
            <button
              type="button"
              className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center text-lg pl-0.5 shadow-xl transition-transform hover:scale-110"
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
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center text-xs backdrop-blur-sm transition-colors border border-white/20 z-10"
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
    <section className="py-14 sm:py-20 bg-[#0f1115] border-t border-b border-white/5" id="reviewsCarousel">
      <div className="wrap max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8B10C] bg-[#E8B10C]/10 px-3 py-1 rounded-full border border-[#E8B10C]/20 inline-block mb-3">
            Vídeos Reais de Clientes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Quem já instalou, aprovou
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Veja os vídeos de clientes reais que adquiriram e testaram o tapete no carro.
          </p>
        </div>

        {/* Video Reviews: Horizontal swipeable on mobile, grid on desktop */}
        <div className="rev-videos-container">
          {REVIEWS_DATA.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onPlay={handleVideoPlay}
              activeVideoId={activeVideoId}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .rev-videos-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        :global(.rev-video-card) {
          background: #171a21;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s, border-color 0.2s;
        }

        :global(.rev-video-card:hover) {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.16);
        }

        @media (max-width: 1024px) {
          .rev-videos-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .rev-videos-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 14px;
            padding: 4px 8px 16px;
            margin: 0 -16px;
            padding-left: 16px;
            padding-right: 16px;
          }

          .rev-videos-container::-webkit-scrollbar {
            display: none;
          }

          :global(.rev-video-card) {
            flex: 0 0 78vw;
            max-width: 310px;
            scroll-snap-align: center;
            padding: 16px;
          }
        }
      `}</style>
    </section>
  );
}
