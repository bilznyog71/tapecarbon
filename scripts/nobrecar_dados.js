// =============================================================================
// scripts.js — ProtectCar Motors / Tapetes Exclusive (versão limpa e estável)
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {

  // ===========================================================================
  // 1. ANO NO FOOTER
  // ===========================================================================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===========================================================================
  // 2. MENU / DRAWER + MODAIS (header)
  // ===========================================================================
  const qs = s => document.querySelector(s);
  const overlay = qs("#hxOverlay");
  const drawer = qs("#hxDrawer");
  const btnMenu = qs("#btnMenu");
  const btnClose = qs("#btnClose");
  const btnAccount = qs("#btnAccount");
  const accountModal = qs("#accountModal");
  const btnAccountClose = qs("#btnAccountClose");
  const accountForm = qs("#accountForm");
  const btnCart = qs("#btnCart");
  const cartModal = qs("#cartModal");
  const btnCartClose = qs("#btnCartClose");
  const btnCartGo = qs("#btnCartGo");
  const searchForm = qs("#searchForm");
  const searchInput = qs("#searchInput");
  const searchModal = qs("#searchModal");
  const btnSearchClose = qs("#btnSearchClose");
  const searchResultText = qs("#searchResultText");
  const searchList = qs("#searchList");

  let lastFocus = null;

  const lockScroll = on => {
    // body é o scroll container real (overflow:auto), precisa travar nele também
    document.documentElement.style.overflow = on ? "hidden" : "";
    document.body.style.overflow = on ? "hidden" : "";
  };

  function openOverlay() {
    if (overlay) overlay.hidden = false;
  }

  function closeOverlayIfNoneOpen() {
    if (!overlay) return;
    const somethingOpen =
      drawer?.classList.contains("isOpen") ||
      accountModal?.classList.contains("isOpen") ||
      cartModal?.classList.contains("isOpen") ||
      searchModal?.classList.contains("isOpen");
    if (!somethingOpen) overlay.hidden = true;
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add("isOpen");
    drawer.setAttribute("aria-hidden", "false");
    btnMenu?.setAttribute("aria-expanded", "true");
    openOverlay();
    lockScroll(true);
    setTimeout(() => drawer.focus(), 0);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("isOpen");
    drawer.setAttribute("aria-hidden", "true");
    btnMenu?.setAttribute("aria-expanded", "false");
    closeOverlayIfNoneOpen();
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("isOpen");
    modal.setAttribute("aria-hidden", "false");
    openOverlay();
    lockScroll(true);
    const first = modal.querySelector("input, button");
    setTimeout(() => first?.focus(), 0);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("isOpen");
    modal.setAttribute("aria-hidden", "true");
    closeOverlayIfNoneOpen();
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }

  // Eventos do menu
  btnMenu?.addEventListener("click", openDrawer);
  btnClose?.addEventListener("click", closeDrawer);
  drawer?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeDrawer));

  // Conta
  btnAccount?.addEventListener("click", () => openModal(accountModal));
  btnAccountClose?.addEventListener("click", () => closeModal(accountModal));
  accountModal?.addEventListener("click", e => {
    if (e.target === accountModal) closeModal(accountModal);
  });
  accountForm?.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(accountForm).entries());
    localStorage.setItem("hx_account", JSON.stringify(data));
    closeModal(accountModal);
  });

  // Carrinho
  btnCart?.addEventListener("click", () => openModal(cartModal));
  btnCartClose?.addEventListener("click", () => closeModal(cartModal));
  cartModal?.addEventListener("click", e => {
    if (e.target === cartModal) closeModal(cartModal);
  });
  btnCartGo?.addEventListener("click", () => {
    closeModal(cartModal);
    window.location.hash = "#bandeja";
  });

  // Busca (com resultados fake)
  searchForm?.addEventListener("submit", e => {
    e.preventDefault();
    const q = (searchInput?.value || "").trim();
    openModal(searchModal);
    searchList.innerHTML = "";
    if (!q) {
      searchResultText.textContent = "Digite algo para buscar.";
      return;
    }
    searchResultText.textContent = `Resultados para: "${q}"`;
    const items = [
      { title: "Tapete Bandeja 3D", note: "Proteção total • Bordas elevadas" },
      { title: "Tapete da Mala", note: "Acabamento premium" },
      { title: "Kit Interno + Mala", note: "Mais completo • Melhor preço" }
    ];
    items
      .filter(i => i.title.toLowerCase().includes(q.toLowerCase()) || q.length < 3)
      .forEach(i => {
        const div = document.createElement("div");
        div.className = "hxResult";
        div.innerHTML = `<div><strong>${i.title}</strong><br><span>${i.note}</span></div><span>→</span>`;
        div.addEventListener("click", () => {
          closeModal(searchModal);
          if (i.title.includes("Bandeja")) window.location.hash = "#bandeja";
          else if (i.title.includes("Mala")) window.location.hash = "#mala";
          else window.location.hash = "#kit";
        });
        searchList.appendChild(div);
      });
  });

  btnSearchClose?.addEventListener("click", () => closeModal(searchModal));
  searchModal?.addEventListener("click", e => {
    if (e.target === searchModal) closeModal(searchModal);
  });

  // Overlay e ESC fecham tudo
  overlay?.addEventListener("click", () => {
    if (drawer?.classList.contains("isOpen")) closeDrawer();
    if (accountModal?.classList.contains("isOpen")) closeModal(accountModal);
    if (cartModal?.classList.contains("isOpen")) closeModal(cartModal);
    if (searchModal?.classList.contains("isOpen")) closeModal(searchModal);
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (drawer?.classList.contains("isOpen")) closeDrawer();
    if (accountModal?.classList.contains("isOpen")) closeModal(accountModal);
    if (cartModal?.classList.contains("isOpen")) closeModal(cartModal);
    if (searchModal?.classList.contains("isOpen")) closeModal(searchModal);
  });

  // ===========================================================================
  // 3. HERO SLIDER
  // ===========================================================================
  const track = document.getElementById("heroTrack");
  const viewport = document.getElementById("heroViewport");
  const dots = Array.from(document.querySelectorAll(".heroDot"));
  const total = dots.length;
  let index = 0;
  let timer = null;

  function setActiveDot(i) {
    dots.forEach(d => d.classList.remove("isActive"));
    dots[i]?.classList.add("isActive");
  }

  function goTo(i) {
    index = (i + total) % total;
    if (track) track.style.transform = `translateX(-${index * 100}%)`;
    setActiveDot(index);
  }

  function start() {
    stop();
    timer = setInterval(() => goTo(index + 1), 5000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      start();
    });
  });

  let startX = 0;
  viewport?.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    stop();
  }, { passive: true });

  viewport?.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const dx = startX - endX;
    if (dx > 45) goTo(index + 1);
    else if (dx < -45) goTo(index - 1);
    start();
  }, { passive: true });

  if (track && viewport) {
    goTo(0);
    start();
  }

  // ===========================================================================
  // 4. REVEAL ON SCROLL (animações ao entrar na tela)
  // ===========================================================================
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("isVisible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(el => obs.observe(el));
  }

  // ===========================================================================
  // 5. TICKER INFINITO (barra superior)
  // ===========================================================================
  /*
   * Clona o set base até cobrir a viewport e anda exatamente a largura de UM
   * set. Com os 2 sets fixos do HTML, em ecrãs largos o conteúdo acabava antes
   * do fim do ecrã: via-se espaço vazio e a faixa parecia "voltar a meio".
   */
  const tickerTrack = document.getElementById("rxTickerTrack");
  if (tickerTrack) {
    const baseSet = tickerTrack.querySelector(".rxTicker__set");

    if (baseSet) {
      let tickerDebounce;

      function buildTicker() {
        // Reduz a um só set antes de reconstruir — senão os clones acumulam
        tickerTrack.querySelectorAll(".rxTicker__set").forEach((el, i) => {
          if (i > 0) el.remove();
        });

        const unit = baseSet.getBoundingClientRect().width;
        if (!unit) return;

        const needed = Math.max(2, Math.ceil(window.innerWidth / unit) + 1);
        for (let i = 1; i < needed; i++) {
          const clone = baseSet.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          tickerTrack.appendChild(clone);
        }

        const speed = 90; // px/s
        tickerTrack.style.setProperty("--rx-shift", `${unit}px`);
        tickerTrack.style.animationDuration = `${Math.max(12, unit / speed)}s`;
      }

      function scheduleTickerBuild() {
        clearTimeout(tickerDebounce);
        tickerDebounce = setTimeout(buildTicker, 180);
      }

      buildTicker();
      window.addEventListener("load", buildTicker);
      window.addEventListener("resize", scheduleTickerBuild);

      // As fontes só carregam depois do primeiro build e mudam a largura do
      // set — sem isto o --rx-shift fica desatualizado e o loop dá um salto.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(buildTicker);
      }

      // Apanha mudanças de largura que o evento resize não cobre (rotação,
      // zoom, aparecimento da scrollbar, reflow do layout).
      if (window.ResizeObserver) {
        new ResizeObserver(scheduleTickerBuild).observe(tickerTrack.parentElement || tickerTrack);
      }
    }
  }

  // ===========================================================================
  // 6. BEFORE / AFTER (arrastar para comparar)
  // ===========================================================================
  document.querySelectorAll(".cmp").forEach(cmp => {
    const drag = cmp.querySelector(".cmp__drag");
    const after = cmp.querySelector(".cmp__after");
    const beforeUrl = cmp.getAttribute("data-before");
    const afterUrl = cmp.getAttribute("data-after");

    if (beforeUrl) cmp.style.backgroundImage = `url(${beforeUrl})`;
    if (after && afterUrl) after.style.backgroundImage = `url(${afterUrl})`;

    let isDown = false;

    function pctFromClientX(clientX) {
      const r = cmp.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - r.left, 0), r.width);
      return (x / r.width) * 100;
    }

    function setP(p) {
      cmp.style.setProperty("--p", `${p}%`);
    }

    setP(50); // inicia no meio

    drag?.addEventListener("mousedown", e => {
      isDown = true;
      setP(pctFromClientX(e.clientX));
    });

    window.addEventListener("mousemove", e => {
      if (!isDown) return;
      setP(pctFromClientX(e.clientX));
    });

    window.addEventListener("mouseup", () => { isDown = false; });

    drag?.addEventListener("touchstart", e => {
      isDown = true;
      setP(pctFromClientX(e.touches[0].clientX));
    }, { passive: true });

    drag?.addEventListener("touchmove", e => {
      if (!isDown) return;
      setP(pctFromClientX(e.touches[0].clientX));
    }, { passive: true });

    drag?.addEventListener("touchend", () => { isDown = false; }, { passive: true });
  });

 

  // ===========================================================================
  // 8. POPUP CUPOM (2 etapas)
  // ===========================================================================
  (function initRvPop() {
    const pop = document.getElementById("rvPop");
    if (!pop) return;

    const step1 = document.getElementById("rvPopStep1");
    const step2 = document.getElementById("rvPopStep2");
    const form = document.getElementById("rvPopForm");
    const copyBtn = document.getElementById("rvCopyCoupon");
    const codeEl = document.getElementById("rvCouponCode");
    const copiedEl = document.getElementById("rvCopied");

    const POP_SEEN_KEY = "rv_coupon_popup_opened_at";
    const COOLDOWN_HOURS = 12;

    function canShowPopup() {
      try {
        const last = Number(localStorage.getItem(POP_SEEN_KEY) || "0");
        if (!last) return true;
        return (Date.now() - last) / (1000 * 60 * 60) >= COOLDOWN_HOURS;
      } catch {
        return true;
      }
    }

    function markPopupOpened() {
      try {
        localStorage.setItem(POP_SEEN_KEY, String(Date.now()));
      } catch {}
    }

    function openPop() {
      markPopupOpened();
      pop.classList.add("is-open");
      pop.setAttribute("aria-hidden", "false");
      if (step1) step1.hidden = false;
      if (step2) step2.hidden = true;
    }

    function closePop() {
      pop.classList.remove("is-open");
      pop.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (copiedEl) copiedEl.hidden = true;
    }

    pop.addEventListener("click", e => {
      if (e.target?.dataset?.rvclose === "1") closePop();
    });

    form?.addEventListener("submit", e => {
      e.preventDefault();
      if (step1) step1.hidden = true;
      if (step2) step2.hidden = false;
    });

    copyBtn?.addEventListener("click", async () => {
      const code = codeEl?.textContent?.trim() || "";
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      if (copiedEl) {
        copiedEl.hidden = false;
        setTimeout(() => copiedEl.hidden = true, 1800);
      }
    });

    if (canShowPopup()) {
      setTimeout(openPop, 700);
    }
  })();

  // ===========================================================================
  // 9. FRETE ESTIMADO (nxShip)
  // ===========================================================================
  (function initNxShip() {
    const box = document.getElementById("nxShip");
    const cityEl = document.getElementById("nxShipCity");
    const etaEl = document.getElementById("nxShipEta");
    if (!box || !cityEl || !etaEl) return;

    const pad2 = n => (n < 10 ? "0" + n : "" + n);
    const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

    function rangeDatas(prazoIni, prazoFim) {
      const now = new Date();
      const a = new Date(now); a.setDate(now.getDate() + prazoIni);
      const b = new Date(now); b.setDate(now.getDate() + prazoFim);
      return `${pad2(a.getDate())} de ${meses[a.getMonth()]} até ${pad2(b.getDate())} de ${meses[b.getMonth()]}`;
    }

    // Mostra imediatamente (sem loading)
    const dateRange = rangeDatas(2, 7);
    cityEl.textContent = "a sua região";
    etaEl.innerHTML = `Entrega estimada entre <strong>${dateRange}</strong>.`;

    // Tenta melhorar com IP (opcional)
    fetch("https://ipv4.wtfismyip.com/json", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        const loc = (data.YourFuckingLocation || "").replace(", Portugal", "").trim();
        if (loc) cityEl.textContent = loc + " e Região";
      })
      .catch(() => {}); // silencioso
  })();

  // ===========================================================================
  // 10. CARROSSEL DE DEPOIMENTOS (satStack)
  // ===========================================================================
  (function initSatStack() {
    const images = [
      "images/6.webp",
      "images/7.webp",
      "images/thum1.webp",
      "images/thum2.webp",
      "images/foto1.webp",
      "images/tapetebom.webp"
    ];

    const track = document.getElementById("satTrack");
    const viewport = document.getElementById("satViewport");
    if (!track || !viewport) return;

    let current = 0;
    let dragging = false;
    let startX = 0;
    let deltaX = 0;

    const cards = images.map((src, i) => {
      const card = document.createElement("div");
      card.className = "satCard";
      card.innerHTML = `<img src="${src}" alt="Foto de cliente ${i + 1}" loading="lazy" decoding="async">`;
      track.appendChild(card);
      return card;
    });

    function mod(n, total) {
      return ((n % total) + total) % total;
    }

    function render() {
      const total = cards.length;
      const prev = mod(current - 1, total);
      const next = mod(current + 1, total);

      cards.forEach((card, i) => {
        card.className = "satCard";
        if (i === current) card.classList.add("satCard--center");
        else if (i === prev) card.classList.add("satCard--left");
        else if (i === next) card.classList.add("satCard--right");
        else if (i < current) card.classList.add("satCard--hiddenLeft");
        else card.classList.add("satCard--hiddenRight");
        card.style.transform = "";
      });
    }

    function goNext() { current = mod(current + 1, cards.length); render(); }
    function goPrev() { current = mod(current - 1, cards.length); render(); }

    function onStart(clientX) {
      dragging = true;
      startX = clientX;
      deltaX = 0;
    }

    function onMove(clientX) {
      if (!dragging) return;
      deltaX = clientX - startX;
      const centerCard = cards[current];
      if (!centerCard) return;
      centerCard.classList.add("is-dragging");
      const moveX = deltaX * 0.22;
      const scale = Math.max(0.94, 1 - Math.abs(deltaX) / 700);
      centerCard.style.transform = `translateX(calc(-50% + ${moveX}px)) scale(${scale})`;
    }

    function onEnd() {
      if (!dragging) return;
      dragging = false;
      const centerCard = cards[current];
      if (centerCard) {
        centerCard.classList.remove("is-dragging");
        centerCard.style.transform = "";
      }
      if (deltaX < -50) goNext();
      else if (deltaX > 50) goPrev();
      else render();
    }

    viewport.addEventListener("touchstart", e => onStart(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchmove", e => onMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchend", onEnd, { passive: true });

    viewport.addEventListener("mousedown", e => {
      e.preventDefault();
      onStart(e.clientX);
    });
    window.addEventListener("mousemove", e => onMove(e.clientX));
    window.addEventListener("mouseup", onEnd);

    render();
  })();

  // ===========================================================================
  // FIM — tudo inicializado
  // ===========================================================================
  console.log("scripts.js carregado com sucesso ✓");
});

// ===========================================================================
// CONTADORES ANIMADOS (rvMetrics)
// ===========================================================================
(function initCounters() {
  const section = document.getElementById("rvMetrics");
  if (!section) return console.warn("Seção rvMetrics não encontrada");

  const counters = section.querySelectorAll(".rvCount");
  if (!counters.length) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  function formatInt(n) {
    return n.toLocaleString("pt-PT");
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";

    if (prefersReduced || target === 0) {
      el.textContent = `${prefix}${formatInt(target)}${suffix}`;
      el.classList.add("is-done");
      return;
    }

    const duration = 1400; // um pouco mais lento e suave
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = Math.round(from + (target - from) * eased);
      el.textContent = `${prefix}${formatInt(value)}${suffix}`;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${formatInt(target)}${suffix}`;
        el.classList.add("is-done");
      }
    }

    requestAnimationFrame(tick);
  }

  let played = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !played) {
          played = true;
          counters.forEach(animateCounter);
          io.disconnect(); // só anima uma vez
        }
      });
    },
    { threshold: 0.4, rootMargin: "0px 0px -100px 0px" } // dispara um pouco antes
  );

  io.observe(section);
})();
// ===========================================================================
// VÍDEOS DAS REVIEWS + VSL — lazy load + play/pause inteligente
// ===========================================================================
(function initLazyVideos() {
  // .nxVSL__video é controlada pelo initVSL — não duplicar observer aqui
  const videos = [...document.querySelectorAll(".rvVideo video, .matVideo, .nxWhyMedia video")];
  if (!videos.length) return;

  /* PORQUE ISTO É ASSIM (scroll a travar no iPhone):
     a versão antiga usava threshold .3 + rootMargin 100px e chamava
     load() + play() DENTRO do callback, ou seja, a meio do scroll. Cada
     load() arranca o descodificador de vídeo e, no Safari do iPhone,
     isso pára o scroll por uns décimos de segundo — o tal "trava e
     depois volta".
     Agora: a decisão espera 140ms de scroll parado e só tocam os 2 mais
     visíveis (2 porque a grelha de reviews mostra 2 lado a lado). */
  const MAX_A_TOCAR = 2;
  const ratios = new Map(videos.map(v => [v, 0]));

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(apply, 140);
  }

  function apply() {
    const ativos = videos
      .filter(v => (ratios.get(v) || 0) >= 0.35)
      .sort((a, b) => (ratios.get(b) || 0) - (ratios.get(a) || 0))
      .slice(0, MAX_A_TOCAR);

    videos.forEach(v => {
      if (ativos.includes(v)) {
        const source = v.querySelector("source");
        if (source && !source.src && source.dataset.src) {
          source.src = source.dataset.src;
          v.load();
        }
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
      schedule();
    },
    // sem rootMargin: nada é carregado antes de estar mesmo no ecrã
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  videos.forEach((v) => {
    v.muted = true;
    v.playsInline = true;
    v.preload = "none";
    observer.observe(v);
  });
})();
// ===========================================================================
// VSL ESPECÍFICA — versão simplificada e mais agressiva
// ===========================================================================
(function initVSL() {
  const player = document.querySelector(".nxVSL__player");
  const video = document.querySelector(".nxVSL__video");
  const overlay = document.querySelector(".nxVSL__overlay");
  const soundBtn = document.querySelector(".nxVSL__sound");

  if (!player || !video || !overlay) return;

  const source = video.querySelector("source");
  // Sem autoplay → botão de "ativar áudio" não tem mais função, esconde permanentemente
  if (soundBtn) soundBtn.hidden = true;

  const overlayTextEl = overlay.querySelector(".nxVSL__overlayText");
  function setOverlay(state) {
    // state: "paused" | "playing" | "ended"
    overlay.classList.toggle("isHidden", state === "playing");
    overlay.classList.toggle("isPaused", state === "paused");
    overlay.classList.toggle("isEnded", state === "ended");
    if (overlayTextEl) {
      overlayTextEl.textContent = state === "ended"
        ? "Clique para assistir novamente"
        : "Toque para assistir com som";
    }
  }

  function ensureSourceLoaded() {
    if (source && source.dataset.src && !source.src) {
      source.src = source.dataset.src;
      video.load();
    }
  }

  // CLIQUE = gesto do usuário → pode tocar COM ÁUDIO (iOS Safari aceita
  // muted=false + play() dentro do mesmo gesto, desde que seja a primeira
  // play() do vídeo, sem switching durante playback)
  function handleUserPlay() {
    ensureSourceLoaded();
    video.playsInline = true;
    if (video.ended) video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // Browser bloqueou áudio → fallback pra muted (último recurso)
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }

  player.addEventListener("click", (e) => {
    if (e.target.closest(".nxVSL__sound")) return;
    if (video.paused || video.ended) {
      handleUserPlay();
    } else {
      video.pause();
    }
  });

  // Eventos do vídeo controlam só o overlay
  video.addEventListener("play",    () => setOverlay("playing"));
  video.addEventListener("playing", () => setOverlay("playing"));
  video.addEventListener("pause",   () => { if (!video.ended) setOverlay("paused"); });
  video.addEventListener("ended",   () => setOverlay("ended"));

  // IO somente para PAUSAR quando o player sai de vista (economia de dados/bateria)
  // — NÃO toca automaticamente em hipótese alguma.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && !video.paused) {
        video.pause();
      }
    });
  }, { threshold: 0.1 });
  io.observe(player);

  // Estado inicial: poster visível, overlay com call-to-click
  setOverlay("paused");
})();

(() => {
  /*
   * Marcas e modelos do mercado PORTUGUÊS.
   *
   * ORDEM = popularidade em Portugal (quota de mercado / parque automóvel),
   * da mais vendida para a menos vendida. NÃO ordenar alfabeticamente na UI —
   * o Object.keys preserva esta ordem de inserção de propósito.
   *
   * Anos: do lançamento em Portugal até hoje (fim:null) ou até deixar de ser
   * vendido. Inclui modelos antigos que ainda circulam cá.
   */
  const dadosCarros = {
    "Renault": [ ["Clio", {inicio:1990, fim:null}], ["Captur", {inicio:2013, fim:null}], ["Mégane", {inicio:1995, fim:null}], ["Mégane E-Tech (Elétrico)", {inicio:2022, fim:null}], ["Austral", {inicio:2022, fim:null}], ["Arkana", {inicio:2021, fim:null}], ["Rafale", {inicio:2024, fim:null}], ["Symbioz", {inicio:2024, fim:null}], ["Scenic", {inicio:1996, fim:null}], ["Scenic E-Tech (Elétrico)", {inicio:2024, fim:null}], ["Grand Scenic", {inicio:2004, fim:2022}], ["Twingo", {inicio:1993, fim:null}], ["Twingo E-Tech (Elétrico)", {inicio:2025, fim:null}], ["Zoe (Elétrico)", {inicio:2012, fim:2024}], ["Kangoo (2 lugares)", {inicio:1997, fim:null}], ["Kangoo (4 lugares)", {inicio:1997, fim:null}], ["Kangoo E-Tech (Elétrico · 2 lugares)", {inicio:2022, fim:null}], ["Kangoo E-Tech (Elétrico · 4 lugares)", {inicio:2022, fim:null}], ["Trafic (2 lugares)", {inicio:1980, fim:null}], ["Trafic (4 lugares)", {inicio:1980, fim:null}], ["Master (2 lugares)", {inicio:1980, fim:null}], ["Master (4 lugares)", {inicio:1980, fim:null}], ["Express", {inicio:1985, fim:2000}], ["Express Van (2 lugares)", {inicio:2021, fim:null}], ["Express Van (4 lugares)", {inicio:2021, fim:null}], ["Espace", {inicio:1984, fim:null}], ["Talisman", {inicio:2015, fim:2022}], ["Laguna", {inicio:1993, fim:2015}], ["Kadjar", {inicio:2015, fim:2022}], ["Koleos", {inicio:2007, fim:2020}], ["Alaskan (Pick-up)", {inicio:2017, fim:2023}], ["Modus", {inicio:2004, fim:2012}], ["Grand Modus", {inicio:2008, fim:2012}], ["Fluence", {inicio:2009, fim:2016}], ["Latitude", {inicio:2010, fim:2015}], ["Vel Satis", {inicio:2001, fim:2009}], ["Avantime", {inicio:2001, fim:2003}], ["Wind", {inicio:2010, fim:2013}], ["Safrane", {inicio:1992, fim:2000}], ["19", {inicio:1988, fim:1997}], ["21", {inicio:1986, fim:1994}], ["25", {inicio:1983, fim:1992}], ["5", {inicio:1972, fim:1996}], ["5 E-Tech (Elétrico)", {inicio:2024, fim:null}], ["4", {inicio:1961, fim:1992}], ["4 E-Tech (Elétrico)", {inicio:2025, fim:null}], ["Super 5", {inicio:1984, fim:1996}], ["Rodeo", {inicio:1970, fim:1987}], ["Fuego", {inicio:1980, fim:1986}], ["9", {inicio:1981, fim:1989}], ["11", {inicio:1983, fim:1989}], ["6", {inicio:1968, fim:1986}] ],
    "Peugeot": [ ["208", {inicio:2012, fim:null}], ["e-208 (Elétrico)", {inicio:2019, fim:null}], ["308", {inicio:2007, fim:null}], ["e-308 (Elétrico)", {inicio:2023, fim:null}], ["408", {inicio:2022, fim:null}], ["e-408 (Elétrico)", {inicio:2024, fim:null}], ["508", {inicio:2010, fim:null}], ["2008", {inicio:2013, fim:null}], ["e-2008 (Elétrico)", {inicio:2019, fim:null}], ["3008", {inicio:2008, fim:null}], ["e-3008 (Elétrico)", {inicio:2024, fim:null}], ["5008", {inicio:2009, fim:null}], ["e-5008 (Elétrico)", {inicio:2024, fim:null}], ["Partner (2 lugares)", {inicio:1996, fim:null}], ["Partner (4 lugares)", {inicio:1996, fim:null}], ["Partner Tepee", {inicio:2008, fim:2018}], ["Rifter (2 lugares)", {inicio:2018, fim:null}], ["Rifter (4 lugares)", {inicio:2018, fim:null}], ["Expert (2 lugares)", {inicio:1995, fim:null}], ["Expert (4 lugares)", {inicio:1995, fim:null}], ["Traveller", {inicio:2016, fim:null}], ["Boxer (2 lugares)", {inicio:1994, fim:null}], ["Boxer (4 lugares)", {inicio:1994, fim:null}], ["Bipper", {inicio:2008, fim:2017}], ["Bipper Tepee", {inicio:2008, fim:2017}], ["iOn (Elétrico)", {inicio:2010, fim:2020}], ["RCZ", {inicio:2010, fim:2015}], ["106", {inicio:1991, fim:2003}], ["107", {inicio:2005, fim:2014}], ["108", {inicio:2014, fim:2021}], ["205", {inicio:1983, fim:1998}], ["206", {inicio:1998, fim:2012}], ["207", {inicio:2006, fim:2014}], ["306", {inicio:1993, fim:2002}], ["307", {inicio:2001, fim:2008}], ["309", {inicio:1985, fim:1993}], ["405", {inicio:1987, fim:1997}], ["406", {inicio:1995, fim:2004}], ["407", {inicio:2004, fim:2011}], ["605", {inicio:1989, fim:1999}], ["607", {inicio:2000, fim:2010}], ["807", {inicio:2002, fim:2014}], ["1007", {inicio:2005, fim:2009}], ["4007", {inicio:2007, fim:2012}], ["4008", {inicio:2012, fim:2017}], ["104", {inicio:1972, fim:1988}], ["204", {inicio:1965, fim:1976}], ["304", {inicio:1969, fim:1980}], ["504", {inicio:1968, fim:1983}], ["505", {inicio:1979, fim:1992}], ["J5", {inicio:1981, fim:1994}], ["J9", {inicio:1980, fim:1987}] ],
    "Mercedes-Benz": [ ["Classe A", {inicio:1997, fim:null}], ["Classe B", {inicio:2005, fim:null}], ["Classe C", {inicio:1993, fim:null}], ["Classe E", {inicio:1993, fim:null}], ["Classe S", {inicio:1972, fim:null}], ["CLA", {inicio:2013, fim:null}], ["CLA Shooting Brake", {inicio:2015, fim:null}], ["CLE", {inicio:2023, fim:null}], ["GLA", {inicio:2013, fim:null}], ["GLB", {inicio:2019, fim:null}], ["GLC", {inicio:2015, fim:null}], ["GLC Coupé", {inicio:2016, fim:null}], ["GLE", {inicio:2015, fim:null}], ["GLE Coupé", {inicio:2015, fim:null}], ["GLS", {inicio:2015, fim:null}], ["EQA (Elétrico)", {inicio:2021, fim:null}], ["EQB (Elétrico)", {inicio:2021, fim:null}], ["EQC (Elétrico)", {inicio:2019, fim:2023}], ["EQE (Elétrico)", {inicio:2022, fim:null}], ["EQS (Elétrico)", {inicio:2021, fim:null}], ["EQV (Elétrico)", {inicio:2020, fim:null}], ["Citan (2 lugares)", {inicio:2012, fim:null}], ["Citan (4 lugares)", {inicio:2012, fim:null}], ["Classe T", {inicio:2022, fim:null}], ["Vito (2 lugares)", {inicio:1996, fim:null}], ["Vito (4 lugares)", {inicio:1996, fim:null}], ["eVito (Elétrico · 2 lugares)", {inicio:2019, fim:null}], ["eVito (Elétrico · 4 lugares)", {inicio:2019, fim:null}], ["Viano", {inicio:2003, fim:2014}], ["Classe V", {inicio:2014, fim:null}], ["Vaneo", {inicio:2002, fim:2005}], ["MB 100", {inicio:1988, fim:1996}], ["Sprinter (2 lugares)", {inicio:1995, fim:null}], ["Sprinter (4 lugares)", {inicio:1995, fim:null}], ["eSprinter (Elétrico · 2 lugares)", {inicio:2019, fim:null}], ["eSprinter (Elétrico · 4 lugares)", {inicio:2019, fim:null}], ["Classe X (Pick-up)", {inicio:2017, fim:2020}], ["Classe G", {inicio:1979, fim:null}], ["Classe R", {inicio:2005, fim:2017}], ["ML", {inicio:1997, fim:2015}], ["GLK", {inicio:2008, fim:2015}], ["CLK", {inicio:1997, fim:2010}], ["CLS", {inicio:2004, fim:2023}], ["SL", {inicio:1954, fim:null}], ["SLK", {inicio:1996, fim:2020}], ["SLC", {inicio:2016, fim:2020}], ["AMG GT", {inicio:2014, fim:null}], ["190", {inicio:1982, fim:1993}], ["Classe C (W202)", {inicio:1993, fim:2000}], ["W123", {inicio:1976, fim:1986}], ["W124", {inicio:1984, fim:1997}], ["W201", {inicio:1982, fim:1993}] ],
    "BMW": [ ["Série 1", {inicio:2004, fim:null}], ["Série 2", {inicio:2014, fim:null}], ["Série 2 Active Tourer", {inicio:2014, fim:null}], ["Série 2 Gran Tourer", {inicio:2015, fim:2022}], ["Série 2 Gran Coupé", {inicio:2019, fim:null}], ["Série 3", {inicio:1975, fim:null}], ["Série 3 Touring", {inicio:1987, fim:null}], ["Série 3 GT", {inicio:2013, fim:2020}], ["Série 4", {inicio:2013, fim:null}], ["Série 4 Gran Coupé", {inicio:2014, fim:null}], ["Série 5", {inicio:1972, fim:null}], ["Série 5 Touring", {inicio:1991, fim:null}], ["Série 5 GT", {inicio:2009, fim:2017}], ["Série 6", {inicio:1976, fim:null}], ["Série 6 GT", {inicio:2017, fim:2023}], ["Série 7", {inicio:1977, fim:null}], ["Série 8", {inicio:1989, fim:null}], ["X1", {inicio:2009, fim:null}], ["X2", {inicio:2018, fim:null}], ["X3", {inicio:2003, fim:null}], ["X4", {inicio:2014, fim:null}], ["X5", {inicio:1999, fim:null}], ["X6", {inicio:2008, fim:null}], ["X7", {inicio:2019, fim:null}], ["iX1 (Elétrico)", {inicio:2022, fim:null}], ["iX2 (Elétrico)", {inicio:2023, fim:null}], ["iX3 (Elétrico)", {inicio:2020, fim:null}], ["iX (Elétrico)", {inicio:2021, fim:null}], ["i3 (Elétrico)", {inicio:2013, fim:2022}], ["i4 (Elétrico)", {inicio:2021, fim:null}], ["i5 (Elétrico)", {inicio:2023, fim:null}], ["i7 (Elétrico)", {inicio:2022, fim:null}], ["i8", {inicio:2014, fim:2020}], ["Z1", {inicio:1989, fim:1991}], ["Z3", {inicio:1995, fim:2002}], ["Z4", {inicio:2002, fim:null}], ["Série 3 (E30)", {inicio:1982, fim:1994}], ["Série 3 (E36)", {inicio:1990, fim:2000}], ["Série 3 (E46)", {inicio:1998, fim:2006}], ["Série 5 (E39)", {inicio:1995, fim:2004}], ["Série 5 (E60)", {inicio:2003, fim:2010}] ],
    "Citroën": [ ["C1", {inicio:2005, fim:2022}], ["C2", {inicio:2003, fim:2009}], ["C3", {inicio:2002, fim:null}], ["ë-C3 (Elétrico)", {inicio:2024, fim:null}], ["C3 Aircross", {inicio:2017, fim:null}], ["ë-C3 Aircross (Elétrico)", {inicio:2024, fim:null}], ["C3 Picasso", {inicio:2009, fim:2017}], ["C4", {inicio:2004, fim:null}], ["ë-C4 (Elétrico)", {inicio:2020, fim:null}], ["C4 X", {inicio:2022, fim:null}], ["ë-C4 X (Elétrico)", {inicio:2022, fim:null}], ["C4 Cactus", {inicio:2014, fim:2023}], ["C4 Picasso", {inicio:2006, fim:2018}], ["Grand C4 Picasso", {inicio:2006, fim:2018}], ["C4 SpaceTourer", {inicio:2018, fim:2022}], ["C4 Aircross", {inicio:2012, fim:2017}], ["C5", {inicio:2001, fim:2017}], ["C5 Aircross", {inicio:2018, fim:null}], ["C5 X", {inicio:2021, fim:null}], ["C6", {inicio:2005, fim:2012}], ["C8", {inicio:2002, fim:2014}], ["C-Crosser", {inicio:2007, fim:2012}], ["C-Zero (Elétrico)", {inicio:2010, fim:2020}], ["C-Elysée", {inicio:2012, fim:2023}], ["Berlingo (2 lugares)", {inicio:1996, fim:null}], ["Berlingo (4 lugares)", {inicio:1996, fim:null}], ["ë-Berlingo (Elétrico · 2 lugares)", {inicio:2021, fim:null}], ["ë-Berlingo (Elétrico · 4 lugares)", {inicio:2021, fim:null}], ["Jumpy (2 lugares)", {inicio:1994, fim:null}], ["Jumpy (4 lugares)", {inicio:1994, fim:null}], ["SpaceTourer", {inicio:2016, fim:null}], ["Jumper (2 lugares)", {inicio:1994, fim:null}], ["Jumper (4 lugares)", {inicio:1994, fim:null}], ["Nemo", {inicio:2008, fim:2017}], ["Ami (Elétrico)", {inicio:2020, fim:null}], ["Xantia", {inicio:1993, fim:2001}], ["XM", {inicio:1989, fim:2000}], ["Evasion", {inicio:1994, fim:2002}], ["Xsara", {inicio:1997, fim:2006}], ["Xsara Picasso", {inicio:1999, fim:2012}], ["Saxo", {inicio:1996, fim:2003}], ["ZX", {inicio:1991, fim:1998}], ["AX", {inicio:1986, fim:1998}], ["BX", {inicio:1982, fim:1994}], ["Visa", {inicio:1978, fim:1988}], ["LNA", {inicio:1976, fim:1986}], ["GS", {inicio:1970, fim:1986}], ["CX", {inicio:1974, fim:1991}], ["DS (clássico)", {inicio:1955, fim:1975}], ["Dyane", {inicio:1967, fim:1983}], ["Méhari", {inicio:1968, fim:1988}], ["2CV", {inicio:1948, fim:1990}], ["C15", {inicio:1984, fim:2005}], ["C25", {inicio:1981, fim:1993}], ["C35", {inicio:1974, fim:1991}] ],
    "Volkswagen": [ ["Polo", {inicio:1975, fim:null}], ["Golf", {inicio:1974, fim:null}], ["Golf Plus", {inicio:2004, fim:2014}], ["Golf Sportsvan", {inicio:2014, fim:2020}], ["T-Cross", {inicio:2019, fim:null}], ["T-Roc", {inicio:2017, fim:null}], ["Taigo", {inicio:2021, fim:null}], ["Tiguan", {inicio:2007, fim:null}], ["Tiguan Allspace", {inicio:2017, fim:null}], ["Touareg", {inicio:2002, fim:null}], ["Passat", {inicio:1973, fim:null}], ["Passat CC", {inicio:2008, fim:2012}], ["CC", {inicio:2012, fim:2017}], ["Arteon", {inicio:2017, fim:null}], ["ID.3 (Elétrico)", {inicio:2020, fim:null}], ["ID.4 (Elétrico)", {inicio:2021, fim:null}], ["ID.5 (Elétrico)", {inicio:2022, fim:null}], ["ID.7 (Elétrico)", {inicio:2023, fim:null}], ["ID. Buzz (Elétrico)", {inicio:2022, fim:null}], ["Caddy (2 lugares)", {inicio:1980, fim:null}], ["Caddy (4 lugares)", {inicio:1980, fim:null}], ["Transporter (2 lugares)", {inicio:1950, fim:null}], ["Transporter (4 lugares)", {inicio:1950, fim:null}], ["Caravelle", {inicio:1990, fim:null}], ["Multivan", {inicio:1990, fim:null}], ["California", {inicio:1988, fim:null}], ["Crafter (2 lugares)", {inicio:2006, fim:null}], ["Crafter (4 lugares)", {inicio:2006, fim:null}], ["LT", {inicio:1975, fim:2006}], ["Amarok (Pick-up)", {inicio:2010, fim:null}], ["Taro (Pick-up)", {inicio:1989, fim:1997}], ["Up!", {inicio:2011, fim:2023}], ["Fox", {inicio:2005, fim:2011}], ["Lupo", {inicio:1998, fim:2005}], ["Sharan", {inicio:1995, fim:2022}], ["Touran", {inicio:2003, fim:null}], ["Scirocco", {inicio:1974, fim:2017}], ["Eos", {inicio:2006, fim:2015}], ["Beetle", {inicio:1998, fim:2019}], ["Carocha", {inicio:1938, fim:2003}], ["Jetta", {inicio:1979, fim:2018}], ["Bora", {inicio:1998, fim:2005}], ["Vento", {inicio:1992, fim:1998}], ["Corrado", {inicio:1988, fim:1995}], ["Phaeton", {inicio:2002, fim:2016}], ["Santana", {inicio:1981, fim:1988}], ["Passat Variant", {inicio:1980, fim:null}] ],
    "Toyota": [ ["Yaris", {inicio:1999, fim:null}], ["Yaris Cross", {inicio:2021, fim:null}], ["Yaris Verso", {inicio:1999, fim:2005}], ["Corolla", {inicio:1966, fim:null}], ["Corolla Cross", {inicio:2022, fim:null}], ["Corolla Verso", {inicio:2001, fim:2009}], ["C-HR", {inicio:2016, fim:null}], ["RAV4", {inicio:1994, fim:null}], ["bZ4X (Elétrico)", {inicio:2022, fim:null}], ["Urban Cruiser (Elétrico)", {inicio:2025, fim:null}], ["Aygo", {inicio:2005, fim:2021}], ["Aygo X", {inicio:2022, fim:null}], ["iQ", {inicio:2008, fim:2015}], ["Hilux (Pick-up)", {inicio:1968, fim:null}], ["Land Cruiser", {inicio:1951, fim:null}], ["Proace (2 lugares)", {inicio:2013, fim:null}], ["Proace (4 lugares)", {inicio:2013, fim:null}], ["Proace Verso", {inicio:2016, fim:null}], ["Proace City (2 lugares)", {inicio:2019, fim:null}], ["Proace City (4 lugares)", {inicio:2019, fim:null}], ["Proace City Verso", {inicio:2019, fim:null}], ["Hiace (2 lugares)", {inicio:1967, fim:null}], ["Hiace (4 lugares)", {inicio:1967, fim:null}], ["Dyna", {inicio:1959, fim:null}], ["Auris", {inicio:2006, fim:2018}], ["Avensis", {inicio:1997, fim:2018}], ["Avensis Verso", {inicio:2001, fim:2009}], ["Prius", {inicio:1997, fim:null}], ["Prius+", {inicio:2012, fim:2021}], ["Verso", {inicio:2009, fim:2018}], ["Verso-S", {inicio:2010, fim:2016}], ["Picnic", {inicio:1996, fim:2001}], ["Previa", {inicio:1990, fim:2006}], ["Camry", {inicio:1982, fim:null}], ["Supra", {inicio:1978, fim:null}], ["GR86", {inicio:2012, fim:null}], ["GR Yaris", {inicio:2020, fim:null}], ["Celica", {inicio:1970, fim:2006}], ["MR2", {inicio:1984, fim:2007}], ["Paseo", {inicio:1991, fim:1999}], ["Starlet", {inicio:1978, fim:1999}], ["Tercel", {inicio:1978, fim:2000}], ["Carina", {inicio:1970, fim:1998}], ["Corona", {inicio:1957, fim:2001}], ["4Runner", {inicio:1984, fim:null}] ],
    "Dacia": [ ["Sandero", {inicio:2008, fim:null}], ["Sandero Stepway", {inicio:2009, fim:null}], ["Duster", {inicio:2010, fim:null}], ["Jogger", {inicio:2022, fim:null}], ["Spring (Elétrico)", {inicio:2021, fim:null}], ["Bigster", {inicio:2025, fim:null}], ["Logan", {inicio:2004, fim:null}], ["Logan MCV", {inicio:2006, fim:2020}], ["Lodgy", {inicio:2012, fim:2022}], ["Dokker", {inicio:2012, fim:2021}], ["Solenza", {inicio:2003, fim:2005}], ["Pick-Up", {inicio:1975, fim:2006}], ["1310", {inicio:1979, fim:2004}], ["1300", {inicio:1969, fim:1982}] ],
    "Opel": [ ["Corsa", {inicio:1982, fim:null}], ["Corsa-e (Elétrico)", {inicio:2019, fim:null}], ["Astra", {inicio:1991, fim:null}], ["Astra Sports Tourer", {inicio:2004, fim:null}], ["Astra Electric (Elétrico)", {inicio:2023, fim:null}], ["Mokka", {inicio:2012, fim:null}], ["Mokka-e (Elétrico)", {inicio:2020, fim:null}], ["Crossland", {inicio:2017, fim:null}], ["Grandland", {inicio:2017, fim:null}], ["Frontera", {inicio:1991, fim:null}], ["Combo (2 lugares)", {inicio:1993, fim:null}], ["Combo (4 lugares)", {inicio:1993, fim:null}], ["Combo Life", {inicio:2018, fim:null}], ["Vivaro (2 lugares)", {inicio:2001, fim:null}], ["Vivaro (4 lugares)", {inicio:2001, fim:null}], ["Vivaro Life", {inicio:2019, fim:null}], ["Movano (2 lugares)", {inicio:1998, fim:null}], ["Movano (4 lugares)", {inicio:1998, fim:null}], ["Zafira", {inicio:1999, fim:null}], ["Zafira Life", {inicio:2019, fim:null}], ["Insignia", {inicio:2008, fim:2022}], ["Meriva", {inicio:2003, fim:2017}], ["Adam", {inicio:2013, fim:2019}], ["Karl", {inicio:2015, fim:2019}], ["Agila", {inicio:2000, fim:2014}], ["Ampera", {inicio:2011, fim:2016}], ["Ampera-e (Elétrico)", {inicio:2017, fim:2020}], ["Antara", {inicio:2006, fim:2015}], ["Sintra", {inicio:1996, fim:1999}], ["Arena", {inicio:1997, fim:2001}], ["Vectra", {inicio:1988, fim:2008}], ["Signum", {inicio:2003, fim:2008}], ["Omega", {inicio:1986, fim:2003}], ["Senator", {inicio:1978, fim:1993}], ["Monza", {inicio:1978, fim:1986}], ["Rekord", {inicio:1953, fim:1986}], ["Calibra", {inicio:1989, fim:1997}], ["Manta", {inicio:1970, fim:1988}], ["Tigra", {inicio:1994, fim:2009}], ["Speedster", {inicio:2000, fim:2005}], ["GT", {inicio:1968, fim:2010}], ["Kadett", {inicio:1962, fim:1993}], ["Ascona", {inicio:1970, fim:1988}] ],
    "Audi": [ ["A1", {inicio:2010, fim:null}], ["A2", {inicio:1999, fim:2005}], ["A3", {inicio:1996, fim:null}], ["A3 Sportback", {inicio:2004, fim:null}], ["A4", {inicio:1994, fim:null}], ["A4 Avant", {inicio:1996, fim:null}], ["A4 Allroad", {inicio:2009, fim:null}], ["A5", {inicio:2007, fim:null}], ["A5 Sportback", {inicio:2009, fim:null}], ["A6", {inicio:1994, fim:null}], ["A6 Avant", {inicio:1995, fim:null}], ["A6 Allroad", {inicio:1999, fim:null}], ["A7", {inicio:2010, fim:null}], ["A8", {inicio:1994, fim:null}], ["Q2", {inicio:2016, fim:null}], ["Q3", {inicio:2011, fim:null}], ["Q4 e-tron (Elétrico)", {inicio:2021, fim:null}], ["Q5", {inicio:2008, fim:null}], ["Q6 e-tron (Elétrico)", {inicio:2024, fim:null}], ["Q7", {inicio:2005, fim:null}], ["Q8", {inicio:2018, fim:null}], ["Q8 e-tron (Elétrico)", {inicio:2018, fim:null}], ["e-tron GT (Elétrico)", {inicio:2021, fim:null}], ["TT", {inicio:1998, fim:2023}], ["R8", {inicio:2006, fim:2024}], ["80", {inicio:1972, fim:1996}], ["90", {inicio:1984, fim:1991}], ["100", {inicio:1968, fim:1994}], ["200", {inicio:1979, fim:1991}], ["V8", {inicio:1988, fim:1993}], ["50", {inicio:1974, fim:1978}], ["Coupé", {inicio:1980, fim:1996}], ["Cabriolet", {inicio:1991, fim:2000}], ["Quattro", {inicio:1980, fim:1991}] ],
    "Nissan": [ ["Micra", {inicio:1982, fim:2023}], ["Juke", {inicio:2010, fim:null}], ["Qashqai", {inicio:2007, fim:null}], ["Qashqai+2", {inicio:2008, fim:2013}], ["X-Trail", {inicio:2001, fim:null}], ["Ariya (Elétrico)", {inicio:2022, fim:null}], ["Leaf (Elétrico)", {inicio:2010, fim:null}], ["Navara (Pick-up)", {inicio:1997, fim:2022}], ["NV200 (2 lugares)", {inicio:2009, fim:2021}], ["NV200 (4 lugares)", {inicio:2009, fim:2021}], ["e-NV200 (Elétrico · 2 lugares)", {inicio:2014, fim:2021}], ["e-NV200 (Elétrico · 4 lugares)", {inicio:2014, fim:2021}], ["Townstar (2 lugares)", {inicio:2022, fim:null}], ["Townstar (4 lugares)", {inicio:2022, fim:null}], ["Primastar (2 lugares)", {inicio:2021, fim:null}], ["Primastar (4 lugares)", {inicio:2021, fim:null}], ["Interstar (2 lugares)", {inicio:2002, fim:null}], ["Interstar (4 lugares)", {inicio:2002, fim:null}], ["Kubistar", {inicio:2003, fim:2009}], ["Vanette", {inicio:1978, fim:2001}], ["Serena", {inicio:1991, fim:2002}], ["Cabstar", {inicio:1981, fim:2013}], ["Atleon", {inicio:2000, fim:2013}], ["Note", {inicio:2004, fim:2017}], ["Pulsar", {inicio:2014, fim:2018}], ["Tiida", {inicio:2004, fim:2012}], ["Pixo", {inicio:2009, fim:2013}], ["Almera", {inicio:1995, fim:2006}], ["Almera Tino", {inicio:2000, fim:2006}], ["Primera", {inicio:1990, fim:2007}], ["Maxima", {inicio:1981, fim:2008}], ["Murano", {inicio:2002, fim:2015}], ["Terrano", {inicio:1986, fim:2006}], ["Patrol", {inicio:1951, fim:2010}], ["Pathfinder", {inicio:1985, fim:2015}], ["Sunny", {inicio:1966, fim:1999}], ["Bluebird", {inicio:1957, fim:1993}], ["100NX", {inicio:1990, fim:1996}], ["200SX", {inicio:1988, fim:2002}], ["350Z", {inicio:2002, fim:2009}], ["370Z", {inicio:2009, fim:2020}], ["GT-R", {inicio:2007, fim:null}], ["Cube", {inicio:1998, fim:2019}] ],
    "Ford": [ ["Fiesta", {inicio:1976, fim:2023}], ["Focus", {inicio:1998, fim:null}], ["Puma", {inicio:1997, fim:null}], ["Puma Gen-E (Elétrico)", {inicio:2025, fim:null}], ["Kuga", {inicio:2008, fim:null}], ["EcoSport", {inicio:2013, fim:2022}], ["Mustang Mach-E (Elétrico)", {inicio:2021, fim:null}], ["Explorer (Elétrico)", {inicio:2024, fim:null}], ["Capri (Elétrico)", {inicio:2024, fim:null}], ["Ranger (Pick-up)", {inicio:1998, fim:null}], ["Ranger Raptor (Pick-up)", {inicio:2019, fim:null}], ["Maverick (Pick-up)", {inicio:1993, fim:null}], ["Bronco", {inicio:1966, fim:null}], ["Transit (2 lugares)", {inicio:1965, fim:null}], ["Transit (4 lugares)", {inicio:1965, fim:null}], ["E-Transit (Elétrico · 2 lugares)", {inicio:2022, fim:null}], ["E-Transit (Elétrico · 4 lugares)", {inicio:2022, fim:null}], ["Transit Custom (2 lugares)", {inicio:2012, fim:null}], ["Transit Custom (4 lugares)", {inicio:2012, fim:null}], ["Transit Connect (2 lugares)", {inicio:2002, fim:null}], ["Transit Connect (4 lugares)", {inicio:2002, fim:null}], ["Transit Courier (2 lugares)", {inicio:2014, fim:null}], ["Transit Courier (4 lugares)", {inicio:2014, fim:null}], ["Tourneo Connect", {inicio:2002, fim:null}], ["Tourneo Custom", {inicio:2012, fim:null}], ["Tourneo Courier", {inicio:2014, fim:null}], ["Courier", {inicio:1991, fim:2002}], ["Mondeo", {inicio:1993, fim:2022}], ["C-Max", {inicio:2003, fim:2019}], ["Grand C-Max", {inicio:2010, fim:2019}], ["S-Max", {inicio:2006, fim:2023}], ["Galaxy", {inicio:1995, fim:2023}], ["Ka", {inicio:1996, fim:2020}], ["Ka+", {inicio:2016, fim:2020}], ["StreetKa", {inicio:2003, fim:2005}], ["B-Max", {inicio:2012, fim:2017}], ["Fusion", {inicio:2002, fim:2012}], ["Escort", {inicio:1968, fim:2002}], ["Orion", {inicio:1983, fim:1993}], ["Sierra", {inicio:1982, fim:1993}], ["Scorpio", {inicio:1985, fim:1998}], ["Granada", {inicio:1972, fim:1985}], ["Taunus", {inicio:1939, fim:1982}], ["Probe", {inicio:1988, fim:1997}], ["Cougar", {inicio:1998, fim:2002}], ["Mustang", {inicio:1964, fim:null}] ],
    "Fiat": [ ["500", {inicio:2007, fim:null}], ["500e (Elétrico)", {inicio:2020, fim:null}], ["500X", {inicio:2014, fim:null}], ["500L", {inicio:2012, fim:2022}], ["600", {inicio:2023, fim:null}], ["600e (Elétrico)", {inicio:2023, fim:null}], ["Panda", {inicio:1980, fim:null}], ["Grande Panda", {inicio:2024, fim:null}], ["Topolino (Elétrico)", {inicio:2023, fim:null}], ["Tipo", {inicio:1988, fim:null}], ["Doblò (2 lugares)", {inicio:2000, fim:null}], ["Doblò (4 lugares)", {inicio:2000, fim:null}], ["E-Doblò (Elétrico · 2 lugares)", {inicio:2022, fim:null}], ["E-Doblò (Elétrico · 4 lugares)", {inicio:2022, fim:null}], ["Ducato (2 lugares)", {inicio:1981, fim:null}], ["Ducato (4 lugares)", {inicio:1981, fim:null}], ["E-Ducato (Elétrico · 2 lugares)", {inicio:2021, fim:null}], ["E-Ducato (Elétrico · 4 lugares)", {inicio:2021, fim:null}], ["Scudo (2 lugares)", {inicio:1996, fim:null}], ["Scudo (4 lugares)", {inicio:1996, fim:null}], ["E-Scudo (Elétrico · 2 lugares)", {inicio:2022, fim:null}], ["E-Scudo (Elétrico · 4 lugares)", {inicio:2022, fim:null}], ["Fiorino (2 lugares)", {inicio:1977, fim:null}], ["Fiorino (4 lugares)", {inicio:1977, fim:null}], ["Talento (2 lugares)", {inicio:2016, fim:2021}], ["Talento (4 lugares)", {inicio:2016, fim:2021}], ["Qubo", {inicio:2008, fim:2020}], ["Ulysse", {inicio:1994, fim:null}], ["Punto", {inicio:1993, fim:2018}], ["Grande Punto", {inicio:2005, fim:2012}], ["Bravo", {inicio:1995, fim:2014}], ["Brava", {inicio:1995, fim:2001}], ["Stilo", {inicio:2001, fim:2010}], ["Croma", {inicio:1985, fim:2011}], ["Marea", {inicio:1996, fim:2002}], ["Multipla", {inicio:1998, fim:2010}], ["Idea", {inicio:2003, fim:2012}], ["Sedici", {inicio:2006, fim:2014}], ["Freemont", {inicio:2011, fim:2016}], ["Coupé", {inicio:1993, fim:2000}], ["Barchetta", {inicio:1995, fim:2005}], ["Seicento", {inicio:1998, fim:2010}], ["Cinquecento", {inicio:1991, fim:1998}], ["Uno", {inicio:1983, fim:2013}], ["Palio", {inicio:1996, fim:2017}], ["Siena", {inicio:1996, fim:2016}], ["Tempra", {inicio:1990, fim:1999}], ["Regata", {inicio:1983, fim:1990}], ["Ritmo", {inicio:1978, fim:1988}], ["Duna", {inicio:1987, fim:2000}], ["127", {inicio:1971, fim:1987}], ["128", {inicio:1969, fim:1985}], ["131", {inicio:1974, fim:1984}], ["500 (clássico)", {inicio:1957, fim:1975}], ["Strada (Pick-up)", {inicio:1996, fim:2020}] ],
    "Hyundai": [ ["i10", {inicio:2008, fim:null}], ["i20", {inicio:2008, fim:null}], ["i30", {inicio:2007, fim:null}], ["i40", {inicio:2011, fim:2019}], ["Bayon", {inicio:2021, fim:null}], ["Kona", {inicio:2017, fim:null}], ["Kona Electric", {inicio:2018, fim:null}], ["Tucson", {inicio:2004, fim:null}], ["Santa Fe", {inicio:2000, fim:null}], ["Ioniq", {inicio:2016, fim:2022}], ["Ioniq 5 (Elétrico)", {inicio:2021, fim:null}], ["Ioniq 6 (Elétrico)", {inicio:2022, fim:null}], ["Ioniq 9 (Elétrico)", {inicio:2025, fim:null}], ["Inster (Elétrico)", {inicio:2024, fim:null}], ["Nexo", {inicio:2018, fim:null}], ["Staria", {inicio:2021, fim:null}], ["H-1 (2 lugares)", {inicio:1996, fim:2021}], ["H-1 (4 lugares)", {inicio:1996, fim:2021}], ["H350 (2 lugares)", {inicio:2015, fim:2021}], ["H350 (4 lugares)", {inicio:2015, fim:2021}], ["i800", {inicio:2008, fim:2021}], ["ix20", {inicio:2010, fim:2019}], ["ix35", {inicio:2010, fim:2015}], ["Veloster", {inicio:2011, fim:2018}], ["Getz", {inicio:2002, fim:2011}], ["Accent", {inicio:1994, fim:2011}], ["Atos", {inicio:1997, fim:2014}], ["Matrix", {inicio:2001, fim:2010}], ["Trajet", {inicio:1999, fim:2008}], ["Terracan", {inicio:2001, fim:2007}], ["Galloper", {inicio:1991, fim:2003}], ["Elantra", {inicio:1990, fim:null}], ["Lantra", {inicio:1990, fim:2000}], ["Sonata", {inicio:1985, fim:null}], ["Coupé", {inicio:1996, fim:2009}], ["Pony", {inicio:1975, fim:2000}] ],
    "Kia": [ ["Picanto", {inicio:2004, fim:null}], ["Rio", {inicio:2000, fim:2023}], ["Ceed", {inicio:2006, fim:null}], ["Cee'd", {inicio:2006, fim:2018}], ["XCeed", {inicio:2019, fim:null}], ["ProCeed", {inicio:2018, fim:null}], ["Stonic", {inicio:2017, fim:null}], ["Niro", {inicio:2016, fim:null}], ["Niro EV (Elétrico)", {inicio:2018, fim:null}], ["Sportage", {inicio:1993, fim:null}], ["Sorento", {inicio:2002, fim:null}], ["EV3 (Elétrico)", {inicio:2024, fim:null}], ["EV5 (Elétrico)", {inicio:2025, fim:null}], ["EV6 (Elétrico)", {inicio:2021, fim:null}], ["EV9 (Elétrico)", {inicio:2023, fim:null}], ["Soul", {inicio:2008, fim:2019}], ["Venga", {inicio:2009, fim:2019}], ["Carens", {inicio:1999, fim:null}], ["Carnival", {inicio:1998, fim:null}], ["Stinger", {inicio:2017, fim:2023}], ["Optima", {inicio:2000, fim:2020}], ["Magentis", {inicio:2000, fim:2010}], ["Opirus", {inicio:2003, fim:2011}], ["Cerato", {inicio:2003, fim:2009}], ["Shuma", {inicio:1997, fim:2004}], ["Clarus", {inicio:1996, fim:2001}], ["Joice", {inicio:1999, fim:2002}], ["Retona", {inicio:1997, fim:2003}], ["Sephia", {inicio:1992, fim:2003}], ["Pride", {inicio:1986, fim:2000}], ["Besta", {inicio:1983, fim:2005}], ["Pregio", {inicio:1995, fim:2006}], ["K2500", {inicio:2004, fim:null}] ],
    "Seat": [ ["Ibiza", {inicio:1984, fim:null}], ["Leon", {inicio:1999, fim:null}], ["Leon Sportstourer", {inicio:2013, fim:null}], ["Arona", {inicio:2017, fim:null}], ["Ateca", {inicio:2016, fim:null}], ["Tarraco", {inicio:2018, fim:null}], ["Mii", {inicio:2011, fim:2021}], ["Mii Electric", {inicio:2019, fim:2021}], ["Toledo", {inicio:1991, fim:2019}], ["Alhambra", {inicio:1996, fim:2020}], ["Altea", {inicio:2004, fim:2015}], ["Altea XL", {inicio:2006, fim:2015}], ["Altea Freetrack", {inicio:2007, fim:2015}], ["Córdoba", {inicio:1993, fim:2009}], ["Exeo", {inicio:2008, fim:2013}], ["Arosa", {inicio:1997, fim:2004}], ["Inca", {inicio:1995, fim:2003}], ["Marbella", {inicio:1986, fim:1998}], ["Terra", {inicio:1987, fim:1996}], ["Málaga", {inicio:1985, fim:1993}], ["Ronda", {inicio:1982, fim:1988}], ["Fura", {inicio:1981, fim:1986}], ["Panda (Seat)", {inicio:1980, fim:1986}], ["127", {inicio:1972, fim:1984}], ["131", {inicio:1975, fim:1984}], ["133", {inicio:1974, fim:1981}] ],
    "Škoda": [ ["Fabia", {inicio:1999, fim:null}], ["Fabia Combi", {inicio:2000, fim:null}], ["Octavia", {inicio:1996, fim:null}], ["Octavia Combi", {inicio:1998, fim:null}], ["Scala", {inicio:2019, fim:null}], ["Kamiq", {inicio:2019, fim:null}], ["Karoq", {inicio:2017, fim:null}], ["Kodiaq", {inicio:2016, fim:null}], ["Superb", {inicio:2001, fim:null}], ["Superb Combi", {inicio:2009, fim:null}], ["Enyaq (Elétrico)", {inicio:2021, fim:null}], ["Enyaq Coupé (Elétrico)", {inicio:2021, fim:null}], ["Elroq (Elétrico)", {inicio:2024, fim:null}], ["Citigo", {inicio:2011, fim:2020}], ["Citigo-e iV (Elétrico)", {inicio:2019, fim:2020}], ["Rapid", {inicio:2012, fim:2019}], ["Roomster", {inicio:2006, fim:2015}], ["Praktik", {inicio:2006, fim:2015}], ["Yeti", {inicio:2009, fim:2017}], ["Felicia", {inicio:1994, fim:2001}], ["Forman", {inicio:1990, fim:1995}], ["Favorit", {inicio:1987, fim:1995}], ["Garde", {inicio:1981, fim:1990}], ["105 / 120", {inicio:1976, fim:1990}], ["Estelle", {inicio:1977, fim:1990}] ],
    "Volvo": [ ["XC40", {inicio:2017, fim:null}], ["EX30 (Elétrico)", {inicio:2023, fim:null}], ["EX40 (Elétrico)", {inicio:2024, fim:null}], ["XC60", {inicio:2008, fim:null}], ["XC90", {inicio:2002, fim:null}], ["EX90 (Elétrico)", {inicio:2024, fim:null}], ["C40 (Elétrico)", {inicio:2021, fim:null}], ["EC40 (Elétrico)", {inicio:2024, fim:null}], ["ES90 (Elétrico)", {inicio:2025, fim:null}], ["C30", {inicio:2006, fim:2013}], ["C70", {inicio:1996, fim:2013}], ["V40", {inicio:1995, fim:2019}], ["V50", {inicio:2004, fim:2012}], ["V60", {inicio:2010, fim:null}], ["V70", {inicio:1996, fim:2016}], ["V90", {inicio:2016, fim:null}], ["S40", {inicio:1995, fim:2012}], ["S60", {inicio:2000, fim:null}], ["S70", {inicio:1996, fim:2000}], ["S80", {inicio:1998, fim:2016}], ["S90", {inicio:2016, fim:null}], ["XC70", {inicio:1997, fim:2016}], ["440", {inicio:1988, fim:1996}], ["460", {inicio:1989, fim:1996}], ["480", {inicio:1986, fim:1995}], ["740", {inicio:1984, fim:1992}], ["760", {inicio:1982, fim:1990}], ["850", {inicio:1991, fim:1997}], ["940", {inicio:1990, fim:1998}], ["960", {inicio:1990, fim:1997}], ["240", {inicio:1974, fim:1993}], ["340", {inicio:1976, fim:1991}], ["360", {inicio:1983, fim:1989}], ["Amazon", {inicio:1956, fim:1970}], ["P1800", {inicio:1961, fim:1973}] ],
    "Cupra": [ ["Formentor", {inicio:2020, fim:null}], ["Leon", {inicio:2020, fim:null}], ["Leon Sportstourer", {inicio:2020, fim:null}], ["Born (Elétrico)", {inicio:2021, fim:null}], ["Ateca", {inicio:2018, fim:null}], ["Tavascan (Elétrico)", {inicio:2024, fim:null}], ["Terramar", {inicio:2024, fim:null}], ["Raval (Elétrico)", {inicio:2026, fim:null}] ],
    "Mini": [ ["Cooper", {inicio:2001, fim:null}], ["Cooper SE (Elétrico)", {inicio:2020, fim:null}], ["Countryman", {inicio:2010, fim:null}], ["Countryman E (Elétrico)", {inicio:2024, fim:null}], ["Clubman", {inicio:2007, fim:2024}], ["Aceman (Elétrico)", {inicio:2024, fim:null}], ["Paceman", {inicio:2012, fim:2016}], ["Cabrio", {inicio:2004, fim:null}], ["Coupé", {inicio:2011, fim:2015}], ["Roadster", {inicio:2012, fim:2015}], ["Mini Clássico", {inicio:1959, fim:2000}] ],
    "Jeep": [ ["Avenger", {inicio:2023, fim:null}], ["Renegade", {inicio:2014, fim:null}], ["Compass", {inicio:2006, fim:null}], ["Wrangler", {inicio:1986, fim:null}], ["Cherokee", {inicio:1974, fim:null}], ["Grand Cherokee", {inicio:1992, fim:null}], ["Commander", {inicio:2005, fim:2010}], ["Gladiator (Pick-up)", {inicio:2020, fim:null}], ["Patriot", {inicio:2007, fim:2016}], ["Willys", {inicio:1941, fim:1968}], ["CJ-7", {inicio:1976, fim:1986}] ],
    "Mazda": [ ["Mazda2", {inicio:2002, fim:null}], ["Mazda2 Hybrid", {inicio:2022, fim:null}], ["Mazda3", {inicio:2003, fim:null}], ["Mazda5", {inicio:2005, fim:2018}], ["Mazda6", {inicio:2002, fim:2024}], ["CX-3", {inicio:2015, fim:2021}], ["CX-30", {inicio:2019, fim:null}], ["CX-5", {inicio:2012, fim:null}], ["CX-60", {inicio:2022, fim:null}], ["CX-7", {inicio:2006, fim:2012}], ["CX-80", {inicio:2024, fim:null}], ["CX-9", {inicio:2007, fim:2015}], ["MX-30 (Elétrico)", {inicio:2020, fim:null}], ["MX-5", {inicio:1989, fim:null}], ["RX-7", {inicio:1978, fim:2002}], ["RX-8", {inicio:2003, fim:2012}], ["Premacy", {inicio:1999, fim:2005}], ["Tribute", {inicio:2000, fim:2011}], ["MPV", {inicio:1988, fim:2016}], ["Demio", {inicio:1996, fim:2002}], ["121", {inicio:1975, fim:2003}], ["323", {inicio:1977, fim:2003}], ["626", {inicio:1979, fim:2002}], ["929", {inicio:1973, fim:1997}], ["Xedos 6", {inicio:1992, fim:1999}], ["Xedos 9", {inicio:1993, fim:2002}], ["B-Series (Pick-up)", {inicio:1961, fim:2006}], ["BT-50 (Pick-up)", {inicio:2006, fim:null}] ],
    "Tesla": [ ["Model 3", {inicio:2019, fim:null}], ["Model Y", {inicio:2021, fim:null}], ["Model S", {inicio:2013, fim:null}], ["Model X", {inicio:2016, fim:null}], ["Cybertruck (Pick-up)", {inicio:2024, fim:null}], ["Roadster", {inicio:2008, fim:2012}] ],
    "Suzuki": [ ["Swift", {inicio:1983, fim:null}], ["Vitara", {inicio:1988, fim:null}], ["Grand Vitara", {inicio:1998, fim:null}], ["S-Cross", {inicio:2013, fim:null}], ["SX4", {inicio:2006, fim:2014}], ["Ignis", {inicio:2000, fim:null}], ["Jimny", {inicio:1970, fim:null}], ["Across", {inicio:2020, fim:null}], ["Swace", {inicio:2020, fim:null}], ["e Vitara (Elétrico)", {inicio:2025, fim:null}], ["Baleno", {inicio:1995, fim:2019}], ["Celerio", {inicio:2014, fim:2019}], ["Splash", {inicio:2008, fim:2014}], ["Alto", {inicio:1979, fim:2014}], ["Wagon R+", {inicio:1997, fim:2006}], ["Liana", {inicio:2001, fim:2007}], ["Kizashi", {inicio:2009, fim:2015}], ["Cappuccino", {inicio:1991, fim:1998}], ["Samurai", {inicio:1985, fim:2004}], ["SJ 413", {inicio:1984, fim:1998}], ["Santana", {inicio:1985, fim:2004}], ["Carry", {inicio:1961, fim:null}] ],
    "Honda": [ ["Jazz", {inicio:2001, fim:null}], ["Civic", {inicio:1972, fim:null}], ["HR-V", {inicio:1999, fim:null}], ["CR-V", {inicio:1995, fim:null}], ["ZR-V", {inicio:2023, fim:null}], ["e:Ny1 (Elétrico)", {inicio:2023, fim:null}], ["Honda e (Elétrico)", {inicio:2020, fim:2024}], ["Accord", {inicio:1976, fim:2018}], ["Insight", {inicio:1999, fim:2014}], ["CR-Z", {inicio:2010, fim:2016}], ["FR-V", {inicio:2004, fim:2009}], ["Stream", {inicio:2000, fim:2006}], ["Shuttle", {inicio:1994, fim:2002}], ["Concerto", {inicio:1988, fim:1994}], ["Logo", {inicio:1996, fim:2001}], ["City", {inicio:1981, fim:null}], ["Integra", {inicio:1985, fim:2006}], ["Prelude", {inicio:1978, fim:2001}], ["Legend", {inicio:1985, fim:2012}], ["S2000", {inicio:1999, fim:2009}], ["NSX", {inicio:1990, fim:2022}] ],
    "Land Rover": [ ["Defender", {inicio:1983, fim:null}], ["Discovery", {inicio:1989, fim:null}], ["Discovery Sport", {inicio:2014, fim:null}], ["Range Rover", {inicio:1970, fim:null}], ["Range Rover Sport", {inicio:2005, fim:null}], ["Range Rover Evoque", {inicio:2011, fim:null}], ["Range Rover Velar", {inicio:2017, fim:null}], ["Freelander", {inicio:1997, fim:2014}], ["Series I", {inicio:1948, fim:1958}], ["Series II", {inicio:1958, fim:1971}], ["Series III", {inicio:1971, fim:1985}], ["88", {inicio:1958, fim:1985}], ["109", {inicio:1958, fim:1985}] ],
    "MG": [ ["MG3", {inicio:2024, fim:null}], ["MG4 (Elétrico)", {inicio:2022, fim:null}], ["MG5 (Elétrico)", {inicio:2021, fim:null}], ["ZS", {inicio:2019, fim:null}], ["ZS EV (Elétrico)", {inicio:2019, fim:null}], ["HS", {inicio:2019, fim:null}], ["S5 EV (Elétrico)", {inicio:2025, fim:null}], ["Cyberster (Elétrico)", {inicio:2024, fim:null}], ["Marvel R (Elétrico)", {inicio:2021, fim:2023}], ["MG6", {inicio:2010, fim:2016}], ["ZR", {inicio:2001, fim:2005}], ["ZT", {inicio:2001, fim:2005}], ["TF", {inicio:2002, fim:2011}], ["MGF", {inicio:1995, fim:2002}], ["MGA", {inicio:1955, fim:1962}], ["MGB", {inicio:1962, fim:1980}], ["Midget", {inicio:1961, fim:1979}] ],
    "Alfa Romeo": [ ["Giulietta", {inicio:2010, fim:2020}], ["Giulia", {inicio:2016, fim:null}], ["Stelvio", {inicio:2017, fim:null}], ["Tonale", {inicio:2022, fim:null}], ["Junior", {inicio:2024, fim:null}], ["MiTo", {inicio:2008, fim:2018}], ["147", {inicio:2000, fim:2010}], ["156", {inicio:1997, fim:2007}], ["159", {inicio:2005, fim:2011}], ["166", {inicio:1998, fim:2007}], ["164", {inicio:1987, fim:1998}], ["155", {inicio:1992, fim:1998}], ["145", {inicio:1994, fim:2001}], ["146", {inicio:1994, fim:2001}], ["GT", {inicio:2003, fim:2010}], ["GTV", {inicio:1974, fim:2005}], ["Brera", {inicio:2005, fim:2010}], ["Spider", {inicio:1966, fim:2010}], ["75", {inicio:1985, fim:1992}], ["90", {inicio:1984, fim:1987}], ["33", {inicio:1983, fim:1995}], ["Alfasud", {inicio:1971, fim:1989}], ["Alfetta", {inicio:1972, fim:1984}], ["Arna", {inicio:1983, fim:1987}], ["Giulietta (clássico)", {inicio:1954, fim:1965}] ],
    "DS Automobiles": [ ["DS 3", {inicio:2010, fim:null}], ["DS 3 Crossback", {inicio:2019, fim:null}], ["DS 4", {inicio:2011, fim:null}], ["DS 4 Crossback", {inicio:2015, fim:2018}], ["DS 5", {inicio:2011, fim:2018}], ["DS 7", {inicio:2017, fim:null}], ["DS 7 Crossback", {inicio:2017, fim:2022}], ["DS 9", {inicio:2020, fim:null}], ["DS N°8 (Elétrico)", {inicio:2025, fim:null}] ],
    "Mitsubishi": [ ["Space Star", {inicio:1998, fim:null}], ["ASX", {inicio:2010, fim:null}], ["Eclipse Cross", {inicio:2017, fim:null}], ["Outlander", {inicio:2001, fim:null}], ["L200 (Pick-up)", {inicio:1978, fim:null}], ["Colt", {inicio:1978, fim:null}], ["Pajero", {inicio:1982, fim:2021}], ["Pajero Pinin", {inicio:1998, fim:2007}], ["Pajero Sport", {inicio:1996, fim:null}], ["Montero", {inicio:1982, fim:2006}], ["Lancer", {inicio:1973, fim:2017}], ["Carisma", {inicio:1995, fim:2004}], ["Galant", {inicio:1969, fim:2012}], ["Sigma", {inicio:1990, fim:1996}], ["Grandis", {inicio:2003, fim:2011}], ["Space Runner", {inicio:1991, fim:2002}], ["Space Wagon", {inicio:1983, fim:2004}], ["Space Gear", {inicio:1994, fim:2006}], ["3000GT", {inicio:1990, fim:2001}], ["Starion", {inicio:1982, fim:1989}], ["i-MiEV (Elétrico)", {inicio:2010, fim:2020}], ["Canter", {inicio:1963, fim:null}], ["L300", {inicio:1979, fim:2013}], ["L400", {inicio:1994, fim:2007}] ],
    "Smart": [ ["ForTwo", {inicio:1998, fim:2024}], ["ForTwo Cabrio", {inicio:2000, fim:2024}], ["ForFour", {inicio:2004, fim:2021}], ["#1 (Elétrico)", {inicio:2022, fim:null}], ["#3 (Elétrico)", {inicio:2023, fim:null}], ["#5 (Elétrico)", {inicio:2025, fim:null}], ["Roadster", {inicio:2003, fim:2006}], ["Crossblade", {inicio:2002, fim:2003}] ],
    "Porsche": [ ["Macan", {inicio:2014, fim:null}], ["Macan EV (Elétrico)", {inicio:2024, fim:null}], ["Cayenne", {inicio:2002, fim:null}], ["Panamera", {inicio:2009, fim:null}], ["Taycan (Elétrico)", {inicio:2019, fim:null}], ["911", {inicio:1963, fim:null}], ["718 Boxster", {inicio:1996, fim:null}], ["718 Cayman", {inicio:2005, fim:null}], ["Carrera GT", {inicio:2003, fim:2007}], ["912", {inicio:1965, fim:1969}], ["924", {inicio:1976, fim:1988}], ["928", {inicio:1977, fim:1995}], ["944", {inicio:1982, fim:1991}], ["968", {inicio:1991, fim:1995}], ["356", {inicio:1948, fim:1965}] ],
    "Lexus": [ ["UX", {inicio:2018, fim:null}], ["UX 300e (Elétrico)", {inicio:2020, fim:null}], ["LBX", {inicio:2023, fim:null}], ["NX", {inicio:2014, fim:null}], ["RX", {inicio:1998, fim:null}], ["RZ (Elétrico)", {inicio:2023, fim:null}], ["GX", {inicio:2002, fim:null}], ["LX", {inicio:1995, fim:null}], ["ES", {inicio:1989, fim:null}], ["IS", {inicio:1998, fim:null}], ["GS", {inicio:1991, fim:2020}], ["LS", {inicio:1989, fim:null}], ["LC", {inicio:2017, fim:null}], ["RC", {inicio:2014, fim:null}], ["SC", {inicio:1991, fim:2010}], ["LM", {inicio:2019, fim:null}], ["CT 200h", {inicio:2011, fim:2022}] ],
    "BYD": [ ["Dolphin (Elétrico)", {inicio:2023, fim:null}], ["Dolphin Surf (Elétrico)", {inicio:2025, fim:null}], ["Atto 2 (Elétrico)", {inicio:2025, fim:null}], ["Atto 3 (Elétrico)", {inicio:2022, fim:null}], ["Seal (Elétrico)", {inicio:2023, fim:null}], ["Seal U (Elétrico)", {inicio:2024, fim:null}], ["Sealion 6", {inicio:2024, fim:null}], ["Sealion 7 (Elétrico)", {inicio:2025, fim:null}], ["Han (Elétrico)", {inicio:2022, fim:null}], ["Tang (Elétrico)", {inicio:2022, fim:null}], ["Seagull (Elétrico)", {inicio:2024, fim:null}] ],
    "Subaru": [ ["Impreza", {inicio:1992, fim:null}], ["XV / Crosstrek", {inicio:2012, fim:null}], ["Forester", {inicio:1997, fim:null}], ["Outback", {inicio:1994, fim:null}], ["Legacy", {inicio:1989, fim:2020}], ["Levorg", {inicio:2014, fim:2020}], ["Solterra (Elétrico)", {inicio:2022, fim:null}], ["BRZ", {inicio:2012, fim:null}], ["WRX", {inicio:1992, fim:null}], ["Tribeca", {inicio:2005, fim:2014}], ["Trezia", {inicio:2011, fim:2014}], ["SVX", {inicio:1991, fim:1997}], ["Justy", {inicio:1984, fim:2011}], ["Vivio", {inicio:1992, fim:1998}], ["Libero", {inicio:1983, fim:1999}] ],
    "Lancia": [ ["Ypsilon", {inicio:1985, fim:null}], ["Delta", {inicio:1979, fim:2014}], ["Musa", {inicio:2004, fim:2012}], ["Thesis", {inicio:2001, fim:2009}], ["Phedra", {inicio:2002, fim:2010}], ["Lybra", {inicio:1998, fim:2005}], ["Kappa", {inicio:1994, fim:2001}], ["Zeta", {inicio:1995, fim:2002}], ["Dedra", {inicio:1989, fim:1999}], ["Thema", {inicio:1984, fim:2014}], ["Prisma", {inicio:1982, fim:1989}], ["Y10", {inicio:1985, fim:1995}], ["Beta", {inicio:1972, fim:1984}], ["Trevi", {inicio:1980, fim:1984}], ["Gamma", {inicio:1976, fim:1984}], ["Fulvia", {inicio:1963, fim:1976}] ],
    "Polestar": [ ["Polestar 2 (Elétrico)", {inicio:2020, fim:null}], ["Polestar 3 (Elétrico)", {inicio:2023, fim:null}], ["Polestar 4 (Elétrico)", {inicio:2024, fim:null}], ["Polestar 5 (Elétrico)", {inicio:2025, fim:null}], ["Polestar 1", {inicio:2019, fim:2021}] ],
    "Alpine": [ ["A110", {inicio:1961, fim:null}], ["A290 (Elétrico)", {inicio:2024, fim:null}], ["A390 (Elétrico)", {inicio:2025, fim:null}], ["A310", {inicio:1971, fim:1984}], ["GTA", {inicio:1984, fim:1991}], ["A610", {inicio:1991, fim:1995}] ],
    "Abarth": [ ["595", {inicio:2008, fim:2023}], ["695", {inicio:2009, fim:null}], ["500e (Elétrico)", {inicio:2023, fim:null}], ["600e (Elétrico)", {inicio:2024, fim:null}], ["124 Spider", {inicio:2016, fim:2019}], ["Grande Punto", {inicio:2007, fim:2010}], ["Punto Evo", {inicio:2010, fim:2014}] ],
    "Leapmotor": [ ["T03 (Elétrico)", {inicio:2024, fim:null}], ["C10 (Elétrico)", {inicio:2024, fim:null}], ["B10 (Elétrico)", {inicio:2025, fim:null}] ],
    "Omoda": [ ["5", {inicio:2024, fim:null}], ["7", {inicio:2025, fim:null}], ["9", {inicio:2025, fim:null}] ],
    "Jaecoo": [ ["7", {inicio:2024, fim:null}], ["5", {inicio:2025, fim:null}], ["8", {inicio:2025, fim:null}] ],
    "Xpeng": [ ["G6 (Elétrico)", {inicio:2024, fim:null}], ["G9 (Elétrico)", {inicio:2024, fim:null}], ["P7 (Elétrico)", {inicio:2024, fim:null}], ["X9 (Elétrico)", {inicio:2025, fim:null}] ],
    "Genesis": [ ["G70", {inicio:2021, fim:null}], ["G80", {inicio:2021, fim:null}], ["GV60 (Elétrico)", {inicio:2022, fim:null}], ["GV70", {inicio:2021, fim:null}], ["GV80", {inicio:2021, fim:null}] ],
    "Lynk & Co": [ ["01", {inicio:2021, fim:null}], ["02 (Elétrico)", {inicio:2024, fim:null}] ],
    "NIO": [ ["ET5 (Elétrico)", {inicio:2023, fim:null}], ["ET7 (Elétrico)", {inicio:2022, fim:null}], ["EL6 (Elétrico)", {inicio:2023, fim:null}], ["EL7 (Elétrico)", {inicio:2023, fim:null}] ],
    "Maxus": [ ["eDeliver 3 (Elétrico · 2 lugares)", {inicio:2020, fim:null}], ["eDeliver 3 (Elétrico · 4 lugares)", {inicio:2020, fim:null}], ["eDeliver 7 (Elétrico)", {inicio:2024, fim:null}], ["eDeliver 9 (Elétrico · 2 lugares)", {inicio:2021, fim:null}], ["eDeliver 9 (Elétrico · 4 lugares)", {inicio:2021, fim:null}], ["Deliver 9 (2 lugares)", {inicio:2020, fim:null}], ["Deliver 9 (4 lugares)", {inicio:2020, fim:null}], ["T60 (Pick-up)", {inicio:2017, fim:null}], ["T90 EV (Pick-up)", {inicio:2022, fim:null}], ["Euniq 5", {inicio:2020, fim:null}] ],
    "Ineos": [ ["Grenadier", {inicio:2022, fim:null}], ["Quartermaster (Pick-up)", {inicio:2024, fim:null}] ],
    "Isuzu": [ ["D-Max (Pick-up)", {inicio:2002, fim:null}], ["Trooper", {inicio:1981, fim:2004}], ["Rodeo (Pick-up)", {inicio:1988, fim:2003}], ["Campo (Pick-up)", {inicio:1972, fim:1994}], ["Midi", {inicio:1980, fim:1995}], ["N-Series", {inicio:1959, fim:null}] ],
    "SsangYong / KGM": [ ["Musso (Pick-up)", {inicio:1993, fim:null}], ["Korando", {inicio:1983, fim:null}], ["Tivoli", {inicio:2015, fim:null}], ["Rexton", {inicio:2001, fim:null}], ["Torres", {inicio:2022, fim:null}], ["Actyon", {inicio:2005, fim:2017}], ["Kyron", {inicio:2005, fim:2014}], ["Rodius", {inicio:2004, fim:2019}], ["Chairman", {inicio:1997, fim:2017}], ["Istana", {inicio:1995, fim:2003}] ],
    "Jaguar": [ ["E-Pace", {inicio:2017, fim:null}], ["F-Pace", {inicio:2016, fim:null}], ["I-Pace (Elétrico)", {inicio:2018, fim:null}], ["XE", {inicio:2015, fim:2024}], ["XF", {inicio:2007, fim:null}], ["XJ", {inicio:1968, fim:2019}], ["XK", {inicio:1996, fim:2014}], ["F-Type", {inicio:2013, fim:2024}], ["S-Type", {inicio:1999, fim:2008}], ["X-Type", {inicio:2001, fim:2009}], ["E-Type", {inicio:1961, fim:1975}], ["Mark 2", {inicio:1959, fim:1967}] ],
    "Chevrolet": [ ["Spark", {inicio:2005, fim:2016}], ["Aveo", {inicio:2002, fim:2015}], ["Cruze", {inicio:2008, fim:2016}], ["Captiva", {inicio:2006, fim:2016}], ["Orlando", {inicio:2010, fim:2015}], ["Trax", {inicio:2013, fim:2016}], ["Matiz", {inicio:1998, fim:2010}], ["Kalos", {inicio:2002, fim:2008}], ["Lacetti", {inicio:2002, fim:2011}], ["Nubira", {inicio:1997, fim:2011}], ["Tacuma", {inicio:2000, fim:2008}], ["Rezzo", {inicio:2000, fim:2008}], ["Epica", {inicio:2006, fim:2011}], ["Evanda", {inicio:2002, fim:2006}], ["Camaro", {inicio:1966, fim:null}], ["Corvette", {inicio:1953, fim:null}], ["Blazer", {inicio:1969, fim:null}] ],
    "Chrysler": [ ["300C", {inicio:2004, fim:2014}], ["Voyager", {inicio:1984, fim:2016}], ["Grand Voyager", {inicio:1990, fim:2016}], ["PT Cruiser", {inicio:2000, fim:2010}], ["Sebring", {inicio:1995, fim:2010}], ["Neon", {inicio:1994, fim:2005}], ["Stratus", {inicio:1995, fim:2006}], ["Crossfire", {inicio:2003, fim:2008}], ["Vision", {inicio:1993, fim:1997}], ["LHS", {inicio:1994, fim:2001}] ],
    "Dodge": [ ["Journey", {inicio:2008, fim:2020}], ["Caliber", {inicio:2006, fim:2012}], ["Nitro", {inicio:2006, fim:2012}], ["Avenger", {inicio:1994, fim:2014}], ["Charger", {inicio:1966, fim:null}], ["Challenger", {inicio:1969, fim:2023}], ["Durango", {inicio:1997, fim:null}], ["RAM 1500 (Pick-up)", {inicio:1981, fim:null}] ],
    "RAM": [ ["1500 (Pick-up)", {inicio:2010, fim:null}], ["2500 (Pick-up)", {inicio:2010, fim:null}], ["ProMaster", {inicio:2013, fim:null}] ],
    "Rover": [ ["25", {inicio:1999, fim:2005}], ["45", {inicio:1999, fim:2005}], ["75", {inicio:1998, fim:2005}], ["100", {inicio:1990, fim:1998}], ["200", {inicio:1984, fim:1999}], ["400", {inicio:1990, fim:1999}], ["600", {inicio:1993, fim:1999}], ["800", {inicio:1986, fim:1999}], ["Streetwise", {inicio:2003, fim:2005}], ["Metro", {inicio:1980, fim:1998}], ["Montego", {inicio:1984, fim:1995}], ["Maestro", {inicio:1983, fim:1994}], ["SD1", {inicio:1976, fim:1986}] ],
    "Saab": [ ["9-3", {inicio:1998, fim:2012}], ["9-5", {inicio:1997, fim:2012}], ["900", {inicio:1978, fim:1998}], ["9000", {inicio:1984, fim:1998}], ["99", {inicio:1968, fim:1984}], ["96", {inicio:1960, fim:1980}] ],
    "Daewoo": [ ["Matiz", {inicio:1998, fim:2005}], ["Lanos", {inicio:1997, fim:2002}], ["Nubira", {inicio:1997, fim:2002}], ["Leganza", {inicio:1997, fim:2002}], ["Kalos", {inicio:2002, fim:2005}], ["Tacuma", {inicio:2000, fim:2005}], ["Espero", {inicio:1990, fim:1997}], ["Nexia", {inicio:1994, fim:1997}], ["Racer", {inicio:1986, fim:1994}], ["Musso", {inicio:1998, fim:2002}], ["Korando", {inicio:1998, fim:2002}] ],
    "Daihatsu": [ ["Terios", {inicio:1997, fim:2017}], ["Sirion", {inicio:1998, fim:2016}], ["Cuore", {inicio:1980, fim:2012}], ["Materia", {inicio:2006, fim:2012}], ["Copen", {inicio:2002, fim:null}], ["YRV", {inicio:2000, fim:2005}], ["Move", {inicio:1995, fim:null}], ["Charade", {inicio:1977, fim:2000}], ["Applause", {inicio:1989, fim:2000}], ["Feroza", {inicio:1988, fim:1998}], ["Rocky", {inicio:1984, fim:2002}], ["Hijet", {inicio:1960, fim:null}] ],
    "Lada": [ ["Niva", {inicio:1977, fim:null}], ["Samara", {inicio:1984, fim:2013}], ["Riva / 2107", {inicio:1980, fim:2012}], ["110", {inicio:1995, fim:2010}], ["Kalina", {inicio:2004, fim:2018}], ["Granta", {inicio:2011, fim:null}], ["Vesta", {inicio:2015, fim:null}] ],
    "Proton": [ ["Satria", {inicio:1994, fim:2005}], ["Wira", {inicio:1993, fim:2009}], ["Persona", {inicio:1993, fim:null}], ["Impian", {inicio:2001, fim:2010}], ["Savvy", {inicio:2005, fim:2011}], ["Gen-2", {inicio:2004, fim:2012}] ],
    "Tata": [ ["Indica", {inicio:1998, fim:2018}], ["Xenon (Pick-up)", {inicio:2007, fim:2019}], ["Telcoline (Pick-up)", {inicio:1988, fim:2007}], ["Safari", {inicio:1998, fim:null}], ["Sumo", {inicio:1994, fim:2019}] ],
    "Talbot": [ ["Horizon", {inicio:1977, fim:1987}], ["Samba", {inicio:1981, fim:1986}], ["Solara", {inicio:1980, fim:1986}], ["Alpine", {inicio:1975, fim:1986}], ["Tagora", {inicio:1980, fim:1983}], ["Express", {inicio:1985, fim:1994}] ],
    "UMM": [ ["Alter II", {inicio:1985, fim:1996}], ["Alter 4x4", {inicio:1978, fim:1996}], ["Cournil", {inicio:1977, fim:1985}], ["Transcat", {inicio:1988, fim:1993}] ],
    "Portaro": [ ["Campeiro", {inicio:1975, fim:1995}], ["Celta", {inicio:1980, fim:1995}], ["Pastor", {inicio:1982, fim:1995}] ],
    "Austin": [ ["Mini", {inicio:1959, fim:2000}], ["Metro", {inicio:1980, fim:1990}], ["Maestro", {inicio:1983, fim:1994}], ["Montego", {inicio:1984, fim:1995}], ["Allegro", {inicio:1973, fim:1982}], ["Princess", {inicio:1975, fim:1981}] ],
    "Morris": [ ["Mini", {inicio:1959, fim:1969}], ["Marina", {inicio:1971, fim:1980}], ["Ital", {inicio:1980, fim:1984}], ["Minor", {inicio:1948, fim:1971}] ],
    "Triumph": [ ["Spitfire", {inicio:1962, fim:1980}], ["TR6", {inicio:1968, fim:1976}], ["TR7", {inicio:1974, fim:1981}], ["Dolomite", {inicio:1972, fim:1980}], ["Acclaim", {inicio:1981, fim:1984}] ],
    "Maserati": [ ["Ghibli", {inicio:2013, fim:null}], ["Levante", {inicio:2016, fim:null}], ["Grecale", {inicio:2022, fim:null}], ["Quattroporte", {inicio:1963, fim:null}], ["GranTurismo", {inicio:2007, fim:null}], ["GranCabrio", {inicio:2010, fim:null}], ["MC20", {inicio:2020, fim:null}], ["3200 GT", {inicio:1998, fim:2002}], ["Coupé", {inicio:2002, fim:2007}] ],
    "Ferrari": [ ["Roma", {inicio:2020, fim:null}], ["Portofino", {inicio:2017, fim:null}], ["296", {inicio:2021, fim:null}], ["SF90", {inicio:2019, fim:null}], ["812", {inicio:2017, fim:null}], ["F8", {inicio:2019, fim:2022}], ["488", {inicio:2015, fim:2019}], ["458", {inicio:2009, fim:2015}], ["California", {inicio:2008, fim:2017}], ["Purosangue", {inicio:2022, fim:null}], ["F430", {inicio:2004, fim:2009}], ["360 Modena", {inicio:1999, fim:2005}], ["Testarossa", {inicio:1984, fim:1996}] ],
    "Lamborghini": [ ["Urus", {inicio:2018, fim:null}], ["Huracán", {inicio:2014, fim:null}], ["Revuelto", {inicio:2023, fim:null}], ["Aventador", {inicio:2011, fim:2022}], ["Gallardo", {inicio:2003, fim:2013}], ["Murciélago", {inicio:2001, fim:2010}], ["Diablo", {inicio:1990, fim:2001}], ["Countach", {inicio:1974, fim:1990}] ],
    "Bentley": [ ["Continental GT", {inicio:2003, fim:null}], ["Flying Spur", {inicio:2005, fim:null}], ["Bentayga", {inicio:2015, fim:null}], ["Mulsanne", {inicio:2010, fim:2020}], ["Arnage", {inicio:1998, fim:2009}] ],
    "Aston Martin": [ ["DB11", {inicio:2016, fim:2023}], ["DB12", {inicio:2023, fim:null}], ["DBX", {inicio:2020, fim:null}], ["Vantage", {inicio:2005, fim:null}], ["DBS", {inicio:2007, fim:null}], ["Rapide", {inicio:2010, fim:2020}], ["DB9", {inicio:2004, fim:2016}], ["Vanquish", {inicio:2001, fim:null}] ],
    "Rolls-Royce": [ ["Ghost", {inicio:2009, fim:null}], ["Phantom", {inicio:2003, fim:null}], ["Cullinan", {inicio:2018, fim:null}], ["Wraith", {inicio:2013, fim:2023}], ["Dawn", {inicio:2015, fim:2023}], ["Spectre (Elétrico)", {inicio:2023, fim:null}] ],
    "Cadillac": [ ["Escalade", {inicio:1998, fim:null}], ["CTS", {inicio:2002, fim:2019}], ["BLS", {inicio:2005, fim:2010}], ["SRX", {inicio:2003, fim:2016}], ["XT4", {inicio:2018, fim:null}], ["Lyriq (Elétrico)", {inicio:2022, fim:null}], ["Seville", {inicio:1975, fim:2004}] ],
    "Iveco": [ ["Daily (2 lugares)", {inicio:1978, fim:null}], ["Daily (4 lugares)", {inicio:1978, fim:null}], ["eDaily (Elétrico)", {inicio:2022, fim:null}], ["Eurocargo", {inicio:1991, fim:null}], ["TurboDaily", {inicio:1990, fim:1999}], ["Massif", {inicio:2007, fim:2011}] ],
    "Piaggio": [ ["Porter", {inicio:1992, fim:null}], ["Porter Maxxi", {inicio:2004, fim:null}], ["Porter NP6", {inicio:2021, fim:null}], ["Ape", {inicio:1948, fim:null}] ],
    "Aixam": [ ["City", {inicio:2010, fim:null}], ["Crossline", {inicio:2010, fim:null}], ["Coupé", {inicio:2012, fim:null}], ["e-City (Elétrico)", {inicio:2015, fim:null}], ["Minauto", {inicio:2009, fim:null}], ["Crossover", {inicio:2014, fim:null}] ],
    "Ligier": [ ["JS50", {inicio:2013, fim:null}], ["JS60", {inicio:2022, fim:null}], ["Myli (Elétrico)", {inicio:2023, fim:null}], ["IXO", {inicio:2008, fim:2014}], ["Nova", {inicio:1998, fim:2005}] ],
    "Microcar": [ ["M.Go", {inicio:2008, fim:null}], ["Dué", {inicio:2010, fim:null}], ["M8", {inicio:2011, fim:2017}], ["Virgo", {inicio:1998, fim:2006}] ],
    "Chatenet": [ ["CH26", {inicio:2004, fim:null}], ["CH30", {inicio:2010, fim:null}], ["CH32", {inicio:2014, fim:null}], ["Barooder", {inicio:1997, fim:2010}] ],
    "Great Wall": [ ["Steed (Pick-up)", {inicio:2006, fim:2021}], ["Wingle (Pick-up)", {inicio:2006, fim:null}], ["Hover", {inicio:2005, fim:2013}] ],
    "Bedford": [ ["Rascal", {inicio:1986, fim:1994}], ["Midi", {inicio:1980, fim:1994}], ["CF", {inicio:1969, fim:1988}] ],
  };

  const kits = {
    carro: [
      {
        id: "carro_sem_porta",
        nome: "Kit interno (sem mala)",
        desc: "Sob medida · segura sujidade e líquidos",
        compare: 129.00,
        sale: 49.90,
        save: 79.10,
        tag: "Mais Procurado",
        tagType: "best",
        img: "images/prod1.webp"
      },
      {
        id: "carro_com_porta",
        nome: "Kit interno + mala",
        desc: "Sob medida · proteção completa",
        compare: 169.00,
        sale: 64.90,
        save: 104.10,
        tag: "Mais Completo",
        tagType: "best",
        img: "images/foto1.webp"
      }
    ],
    picape: [
      {
        id: "picape_sem_cacamba",
        nome: "Kit interno (sem caixa de carga)",
        desc: "Sob medida · encaixe perfeito",
        compare: 189.00,
        sale: 69.90,
        save: 119.10,
        tag: "MELHOR PREÇO",
        tagType: "price",
        img: "images/prod1.webp"
      },
      {
        id: "picape_com_cacamba",
        nome: "Kit interno + caixa de carga",
        desc: "Sob medida · proteção total",
        compare: 229.00,
        sale: 84.90,
        save: 144.10,
        tag: "Mais Completo",
        tagType: "best",
        img: "images/cacamba.jpeg"
      }
    ]
  };

const checkoutLinks = {
  carro_sem_porta: {
    preto: "/checkout/?token=Z-658a9e87c2b4d5e8",
    cinza: "/checkout/?token=Z-658a9e87c2b4d5e8",
    bege:  "/checkout/?token=Z-658a9e87c2b4d5e8"
  },
  carro_com_porta: {
    preto: "/checkout/?token=Z-73c1d9f8e2a6b4c9",
    cinza: "/checkout/?token=Z-73c1d9f8e2a6b4c9",
    bege:  "/checkout/?token=Z-73c1d9f8e2a6b4c9"
  },
  picape_sem_cacamba: {
    preto: "/checkout/?token=Z-82f7d6a5e1b9c3d4",
    cinza: "/checkout/?token=Z-82f7d6a5e1b9c3d4",
    bege:  "/checkout/?token=Z-82f7d6a5e1b9c3d4"
  },
  picape_com_cacamba: {
    preto: "/checkout/?token=Z-91e8c7d6a5b4c3d2",
    cinza: "/checkout/?token=Z-91e8c7d6a5b4c3d2",
    bege:  "/checkout/?token=Z-91e8c7d6a5b4c3d2"
  }
};

  const st = {
    tipo: "carro",
    marca: null,
    modelo: null,
    ano: null,
    cor: "preto",
    textura: "classic",
    kit: null
  };


  const fmtEUR = (v) => "€ " + v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtEURPlain = (v) => v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function getYearsRange(inicio, fim){
    const agora = new Date().getFullYear();

    /* Margem de matrícula.
       A data de FIM na tabela é quando o modelo saiu de produção — não é a
       última matrícula em Portugal. Um Kadjar "até 2022" ainda foi matriculado
       aqui em 2023 (stock do concessionário) e continua a entrar importado
       depois disso. Sem esta folga, esse cliente não encontra o ano da sua
       matrícula na lista — e quem não encontra o próprio carro desconfia da
       loja e vai-se embora.
       O risco é assimétrico: um ano a mais na lista não custa nada, porque
       ninguém o escolhe; um ano a menos custa a venda. Daí a folga, sempre
       limitada ao ano corrente. */
    const MARGEM_MATRICULA = 2;
    const end = fim == null ? agora : Math.min(fim + MARGEM_MATRICULA, agora);

    const arr = [];
    for(let y = end; y >= inicio; y--) arr.push(y);
    return arr;
  }

  function labelCor(c){
    if(c === "preto") return "Preto";
    if(c === "cinza") return "Cinza";
    if(c === "bege") return "Bege";
    return "";
  }

  function labelTextura(value){
    if(value === "Circuito / Tech") return "Circuito / Tech";
    if(value === "Fluxo / Ondas") return "Fluxo / Ondas";
    if(value === "Pedra / Off-Road") return "Pedra / Off-Road";
    return value || "";
  }

  function getKitName(tipo, id){
    const arr = kits[tipo] || [];
    const found = arr.find((k) => k.id === id);
    return found ? found.nome : "";
  }

  function resolveCheckoutUrl(){
    if(!st.kit || !st.cor) return null;
    return checkoutLinks?.[st.kit]?.[st.cor] || null;
  }

  function calcDiscount(compare, sale){
    return Math.round(((compare - sale) / compare) * 100);
  }

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
      return map[char] || char;
    });
  }

  const mainImg = document.getElementById("ctaProMainImg");
  const thumbs = document.getElementById("ctaProThumbs");

  const typeButtons = Array.from(document.querySelectorAll(".rvTypeBtn"));
  const kitGrid = document.getElementById("rvKitGrid");
  const priceCompare = document.getElementById("rvPriceCompare");
  const priceMain = document.getElementById("rvPriceMain");
  const priceSave = document.getElementById("rvPriceSave");
  const confirmBtn = document.getElementById("rvConfirmBtn");

  const btnMarca = document.getElementById("rvBtnMarca");
  const btnModelo = document.getElementById("rvBtnModelo");
  const btnAno = document.getElementById("rvBtnAno");
  const txtMarca = document.getElementById("rvTxtMarca");
  const txtModelo = document.getElementById("rvTxtModelo");
  const txtAno = document.getElementById("rvTxtAno");

  const colorButtons = Array.from(document.querySelectorAll(".rvColor"));
  const textureButtons = Array.from(document.querySelectorAll(".rvTexture"));
  const inlineError = document.getElementById("rvInlineError");

  const sheet = document.getElementById("rvSheet");
  const sheetBg = document.getElementById("rvSheetBg");
  const sheetClose = document.getElementById("rvSheetClose");
  const sheetTitle = document.getElementById("rvSheetTitle");
  const sheetSub = document.getElementById("rvSheetSub");
  const sheetSearch = document.getElementById("rvSheetSearch");
  const sheetList = document.getElementById("rvSheetList");

  const modal = document.getElementById("rvModal");
  const modalBg = document.getElementById("rvModalBg");
  const modalClose = document.getElementById("rvModalClose");
  const modalBody = document.getElementById("rvModalBody");
  const modalEdit = document.getElementById("rvModalEdit");
  const modalGo = document.getElementById("rvModalGo");

  let priceBadge = null;
  let sheetCtx = null;

  thumbs?.addEventListener("click", (e) => {
    const btn = e.target.closest(".ctaPro__thumb");
    if(!btn) return;
    const src = btn.getAttribute("data-src");
    if(!src) return;
    mainImg.src = src;
    thumbs.querySelectorAll(".ctaPro__thumb").forEach((el) => {
      el.classList.toggle("is-active", el === btn);
    });
  });

  if(
    !kitGrid ||
    !confirmBtn ||
    !btnMarca ||
    !btnModelo ||
    !btnAno ||
    !txtMarca ||
    !txtModelo ||
    !txtAno ||
    !sheet ||
    !sheetBg ||
    !sheetClose ||
    !sheetTitle ||
    !sheetSub ||
    !sheetSearch ||
    !sheetList ||
    !modal ||
    !modalBg ||
    !modalClose ||
    !modalBody ||
    !modalEdit ||
    !modalGo
  ){
    return;
  }

  function ensurePriceBadge(){
    if(priceBadge) return priceBadge;
    /* Sem caixa de preço não há onde pendurar o badge — devolve um elemento
       solto para quem chamar poder escrever nele sem verificar. */
    if(!priceCompare) return document.createElement("div");

    priceBadge = document.createElement("div");
    priceBadge.id = "rvPriceBadge";
    priceBadge.setAttribute(
      "style",
      "display:inline-flex;align-items:center;gap:6px;background:#001A33;color:#fff;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;"
    );

    const priceBox = priceCompare.closest(".rvPriceBox");
    if(priceBox && priceCompare.parentNode === priceBox){
      priceBox.insertBefore(priceBadge, priceCompare);
    }

    return priceBadge;
  }

  function setInlineError(message){
    if(!inlineError) return;
    inlineError.textContent = message || "";
    inlineError.classList.toggle("is-show", Boolean(message));
  }

  function clearInlineError(){
    setInlineError("");
  }

  function setButtonState(button, enabled){
    button.disabled = !enabled;
    button.classList.toggle("is-disabled", !enabled);
  }

  function getCurrentKit(){
    return (kits[st.tipo] || []).find((item) => item.id === st.kit) || null;
  }

  /* A caixa de preço do configurador foi removida a pedido do MK
     (2026-08-22). Os elementos já não existem no HTML — os preços passaram a
     estar só nos cartões de kit (rvKitCard__sale) e no checkout.
     A função fica, e continua a ser chamada em vários sítios; escreve apenas
     no que existir, para o dia em que a caixa voltar. */
  function updatePriceBox(){
    const kit = getCurrentKit();
    if(!kit) return;

    if(priceCompare) priceCompare.textContent = `de ${fmtEUR(kit.compare)}`;
    if(priceMain)    priceMain.textContent    = fmtEURPlain(kit.sale);
    if(priceSave)    priceSave.textContent    = `Economize ${fmtEUR(kit.save)}`;
    if(priceCompare) ensurePriceBadge().textContent = `${calcDiscount(kit.compare, kit.sale)}% OFF`;
  }

  function renderKits(){
    const availableKits = kits[st.tipo] || [];
    if(!availableKits.length){
      kitGrid.innerHTML = "";
      st.kit = null;
      return;
    }

    if(!availableKits.some((item) => item.id === st.kit)){
      st.kit = availableKits[0].id;
    }

    kitGrid.innerHTML = "";

       availableKits.forEach((kit) => {
      const card = document.createElement("div");
      card.className = "rvKitCard" + (st.kit === kit.id ? " is-on" : "");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-pressed", st.kit === kit.id ? "true" : "false");
      card.innerHTML = `
        <div class="rvKitCard__tag${kit.tagType === 'best' ? ' rvKitCard__tag--green' : ''}">${escapeHtml(kit.tag)}</div>
        <div class="rvKitCard__media">
          <img src="${escapeHtml(kit.img)}" alt="${escapeHtml(kit.nome)}">
        </div>
        <div class="rvKitCard__content">
          <h3 class="rvKitCard__title">${escapeHtml(kit.nome)}</h3>
          <p class="rvKitCard__desc">${escapeHtml(kit.desc)}</p>
          <p class="rvKitCard__compare">${escapeHtml(fmtEUR(kit.compare))}</p>
          <p class="rvKitCard__sale">${escapeHtml(fmtEUR(kit.sale))}</p>
        </div>
      `;

      const selectKit = () => {
        st.kit = kit.id;
        renderKits();
        updatePriceBox();
        clearInlineError();

        const configBlock = btnMarca?.closest(".rvBlock");
        if(configBlock){
          window.setTimeout(() => {
            if (typeof window.smoothScrollToEl === "function") {
              window.smoothScrollToEl(configBlock, 120);
            } else {
              configBlock.scrollIntoView({ block: "start" });
            }
          }, 160);
        }
      };

      card.addEventListener("click", selectKit);
      card.addEventListener("keydown", (event) => {
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          selectKit();
        }
      });

      kitGrid.appendChild(card);
    });


    updatePriceBox();
  }

  function resetMarca(){
    st.marca = null;
    st.modelo = null;
    st.ano = null;
    txtMarca.textContent = "Selecionar marca";
    txtModelo.textContent = "Aguardando marca...";
    txtAno.textContent = "Aguardando modelo...";
    setButtonState(btnModelo, false);
    setButtonState(btnAno, false);
  }

  function resetModelo(){
    st.modelo = null;
    st.ano = null;
    txtModelo.textContent = "Selecionar modelo";
    txtAno.textContent = "Aguardando modelo...";
    setButtonState(btnAno, false);
  }

  function resetAno(){
    st.ano = null;
    txtAno.textContent = "Selecionar ano";
  }


  function fillSheetList(items){
    sheetList.innerHTML = "";

    if(!items.length){
      sheetList.innerHTML = `
        <div class="rvSheet__item">
          <div>
            <div class="rvSheet__itemTitle">Nenhum resultado</div>
            <div class="rvSheet__itemSub">Tente outro termo</div>
          </div>
          <div>•</div>
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "rvSheet__item";
      row.innerHTML = `
        <div>
          <div class="rvSheet__itemTitle">${escapeHtml(item.t)}</div>
          ${item.s ? `<div class="rvSheet__itemSub">${escapeHtml(item.s)}</div>` : ""}
        </div>
        <div>›</div>
      `;
      row.addEventListener("click", () => {
        closeSheet();
        sheetCtx?.onPick?.(item.val);
      });
      sheetList.appendChild(row);
    });
  }

 function openSheet(ctx){
  sheetCtx = ctx;
  rvSheetTitle.textContent = ctx.title;
  rvSheetSub.textContent = ctx.sub || "Toque em uma opção";
  rvSheetSearch.value = "";
  rvSheetSearch.setAttribute("readonly", "readonly");
  fillSheetList(ctx.items);
  rvSheet.classList.add("is-on");
  document.body.classList.add("rv-sheet-open");
}

function closeSheet(){
  rvSheet.classList.remove("is-on");
  rvSheetSearch.value = "";
  rvSheetSearch.setAttribute("readonly", "readonly");
  document.body.classList.remove("rv-sheet-open");
}

  function openMarcaSheet(){
    openSheet({
      title: "Selecione a marca",
      sub: "Escolha a fabricante do veículo",
      // SEM .sort() — a ordem de dadosCarros é a popularidade em Portugal,
      // da marca mais vendida para a menos vendida.
      items: Object.keys(dadosCarros)
        .map((marca) => ({ t: marca, val: marca })),
      onPick: (marca) => {
        st.marca = marca;
        txtMarca.textContent = marca;
        resetModelo();
        txtModelo.textContent = "Selecionar modelo";
        setButtonState(btnModelo, true);
        clearInlineError();
      }
    });
  }

  function openModeloSheet(){
    if(!st.marca) return;
    // SEM .sort() — tal como na lista de marcas. A ordem de inserção em
    // dadosCarros já é a popularidade em Portugal (Renault: Clio, Captur,
    // Mégane…) e os clássicos ficam no fim. Ordenar por alfabeto punha o
    // "11", o "19" e o "4" à frente do Clio: quem abria a lista via meia
    // dúzia de modelos dos anos 80 e concluía que faltavam carros.
    // Para procurar um modelo específico há o campo de busca da folha.
    const modelos = (dadosCarros[st.marca] || [])
      /* Sem legenda de anos. Nenhum nome de modelo se repete dentro da
         mesma marca (as gerações já vêm distinguidas no próprio nome:
         "Série 3" vs "Série 3 (E30)", "500" vs "500 (clássico)"), e o passo
         seguinte só oferece os anos válidos desse modelo. A data aqui não
         acrescentava nada — só repetia o ecrã a seguir. A faixa continua
         guardada em dadosCarros, que é quem alimenta o seletor de ano. */
      .map(([modelo]) => ({ t: modelo, val: modelo }));

    openSheet({
      title: "Selecione o modelo",
      sub: st.marca,
      items: modelos,
      onPick: (modelo) => {
        st.modelo = modelo;
        txtModelo.textContent = modelo;
        resetAno();
        txtAno.textContent = "Selecionar ano";
        setButtonState(btnAno, true);
        clearInlineError();
      }
    });
  }

  function openAnoSheet(){
    if(!st.marca || !st.modelo) return;
    const faixa = (dadosCarros[st.marca] || []).find(([nome]) => nome === st.modelo)?.[1];
    const anos = faixa ? getYearsRange(faixa.inicio, faixa.fim) : [];

    openSheet({
      title: "Selecione o ano",
      sub: `${st.marca} • ${st.modelo}`,
      items: anos.map((ano) => ({ t: String(ano), val: String(ano) })),
      onPick: (ano) => {
        st.ano = ano;
        txtAno.textContent = String(ano);
        clearInlineError();
      }
    });
  }

  function openModal(){
    const kit = getCurrentKit();
    modalBody.innerHTML = `
      <div class="rvModal__row"><b>Tipo</b><span>${escapeHtml(st.tipo === "picape" ? "Pick-up" : "Carro")}</span></div>
      <div class="rvModal__row"><b>Kit</b><span>${escapeHtml(kit?.nome || "")}</span></div>
      <div class="rvModal__row"><b>Marca</b><span>${escapeHtml(st.marca)}</span></div>
      <div class="rvModal__row"><b>Modelo</b><span>${escapeHtml(st.modelo)}</span></div>
      <div class="rvModal__row"><b>Ano</b><span>${escapeHtml(st.ano)}</span></div>
      <div class="rvModal__row"><b>Cor</b><span>${escapeHtml(labelCor(st.cor))}</span></div>
      <div class="rvModal__row"><b>Textura</b><span>${escapeHtml(labelTextura(st.textura))}</span></div>
      <div class="rvModal__row"><b>Total</b><span>${escapeHtml(fmtEUR(kit?.sale || 0))}</span></div>
    `;
    modal.classList.add("is-on");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(){
    modal.classList.remove("is-on");
    modal.setAttribute("aria-hidden", "true");
  }

  function validatePanel(){
    if(!st.kit) return "Selecione um kit para continuar.";
    if(!st.marca) return "Selecione a marca do veículo.";
    if(!st.modelo) return "Selecione o modelo do veículo.";
    if(!st.ano) return "Selecione o ano do veículo.";
    if(!st.cor) return "Selecione a cor do tapete.";
    if(!st.textura) return "Selecione a textura do tapete.";
    return "";
  }

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTipo = button.dataset.tipo || "carro";
      if(nextTipo === st.tipo) return;

      st.tipo = nextTipo;
      typeButtons.forEach((item) => {
        item.classList.toggle("is-on", item === button);
      });

      renderKits();
      clearInlineError();
    });
  });

  window.selectKitFromCatalog = function(cat) {
    let nextTipo = "carro";
    let nextKit = "carro_sem_porta";
    
    if (cat === "carro") {
      nextTipo = "carro";
      nextKit = "carro_sem_porta";
    } else if (cat === "carro-portamalas") {
      nextTipo = "carro";
      nextKit = "carro_com_porta";
    } else if (cat === "pickup") {
      nextTipo = "picape";
      nextKit = "picape_sem_cacamba";
    } else if (cat === "pickup-cacamba") {
      nextTipo = "picape";
      nextKit = "picape_com_cacamba";
    }
    
    // Set state
    st.tipo = nextTipo;
    st.kit = nextKit;
    
    // Update type buttons classes
    typeButtons.forEach((button) => {
      button.classList.toggle("is-on", button.dataset.tipo === st.tipo);
    });
    
    // Render and update box
    renderKits();
    updatePriceBox();
    clearInlineError();
  };

  btnMarca.addEventListener("click", openMarcaSheet);
  btnModelo.addEventListener("click", openModeloSheet);
  btnAno.addEventListener("click", openAnoSheet);

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      st.cor = button.dataset.cor || "";
      colorButtons.forEach((item) => {
        item.classList.toggle("is-on", item === button);
      });
      clearInlineError();
    });
  });

  textureButtons.forEach((button) => {
    button.addEventListener("click", () => {
      st.textura = button.dataset.textura || "";
      textureButtons.forEach((item) => {
        item.classList.toggle("is-on", item === button);
      });
      clearInlineError();
    });
  });

  sheetBg.addEventListener("click", closeSheet);
  sheetClose.addEventListener("click", closeSheet);

  sheetSearch.addEventListener("pointerdown", () => {
    sheetSearch.removeAttribute("readonly");
    setTimeout(() => sheetSearch.focus(), 0);
  });

  /* Busca sem acentos: ninguém escreve "Mégane", "Citroën" ou "Škoda" com
     o acento certo no telemóvel. Antes, procurar "megane" não devolvia nada
     e parecia que o modelo não existia na lista. NFD separa a letra do
     acento e o range remove só os acentos. */
  const semAcento = (t) => (t || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  sheetSearch.addEventListener("input", () => {
    if(!sheetCtx) return;
    const q = semAcento(sheetSearch.value.trim());
    const filtered = sheetCtx.items.filter((item) =>
      semAcento(item.t).includes(q) || semAcento(item.s).includes(q)
    );
    fillSheetList(filtered);
  });

  modalBg.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  modalEdit.addEventListener("click", closeModal);

  modalGo.addEventListener("click", () => {
    const url = resolveCheckoutUrl();
    if(!url){
      closeModal();
      setInlineError("Não foi possível continuar. Confira o kit e a cor selecionados.");
      return;
    }

    // Adiciona kit, montante e dados do veículo à URL de checkout
    const kitObj = kits[st.tipo]?.find(k => k.id === st.kit);
    const extraParams = new URLSearchParams();
    extraParams.set("kit", st.kit || "");
    if (kitObj) extraParams.set("amount", kitObj.sale);
    if (st.marca)   extraParams.set("marca", st.marca);
    if (st.modelo)  extraParams.set("modelo", st.modelo);
    if (st.ano)     extraParams.set("ano", st.ano);
    if (st.cor)     extraParams.set("cor", st.cor);
    if (st.textura) extraParams.set("textura", st.textura);
    const joinerExtra = url.includes("?") ? "&" : "?";
    const urlWithExtra = url + joinerExtra + extraParams.toString();

    // Anexa as UTMs persistidas (UTMify) à URL de checkout.
    let finalUrl;
    if (typeof window.ccBuildCheckoutUrl === "function") {
      finalUrl = window.ccBuildCheckoutUrl(urlWithExtra);
    } else {
      const qs = (window.location.search || "").replace(/^\?/, "");
      const joiner = urlWithExtra.includes("?") ? "&" : "?";
      finalUrl = urlWithExtra + (qs ? joiner + qs : "");
    }
    try {
      var tokenMatch = (url || "").match(/token=([^&]+)/);
      var contentId = tokenMatch ? tokenMatch[1] : "protectcar";
      var eid = "atc_" + contentId + "_" + Date.now();
      if (typeof window.metaTrack === "function") {
        window.metaTrack("AddToCart", {
          content_type: "product",
          content_ids: [contentId],
          currency: "EUR",
          num_items: 1
        }, eid);
      }
    } catch (e) {}
    window.location.href = finalUrl;
  });

  confirmBtn.addEventListener("click", () => {
    const error = validatePanel();
    if(error){
      setInlineError(error);
      return;
    }

    clearInlineError();
    
    const url = resolveCheckoutUrl();
    if(!url){
      setInlineError("Não foi possível continuar. Confira o kit e a cor selecionados.");
      return;
    }
    
    // Adiciona kit, montante e dados do veículo à URL de checkout
    const kitObjC = kits[st.tipo]?.find(k => k.id === st.kit);
    const params = new URLSearchParams();
    params.set("kit", st.kit || "");
    if (kitObjC) params.set("amount", kitObjC.sale);
    if (st.marca)   params.set("marca", st.marca);
    if (st.modelo)  params.set("modelo", st.modelo);
    if (st.ano)     params.set("ano", st.ano);
    if (st.cor)     params.set("cor", st.cor);
    if (st.textura) params.set("textura", st.textura);

    const pStr = params.toString();
    const resolvedUrl = url + (url.includes("?") ? "&" : "?") + pStr;

    // Anexa as UTMs persistidas (UTMify) à URL de checkout.
    let finalUrl;
    if (typeof window.ccBuildCheckoutUrl === "function") {
      finalUrl = window.ccBuildCheckoutUrl(resolvedUrl);
    } else {
      // fallback: usa o query string da página atual
      const qs = (window.location.search || "").replace(/^\?/, "");
      const joiner = resolvedUrl.includes("?") ? "&" : "?";
      finalUrl = resolvedUrl + (qs ? joiner + qs : "");
    }
    try {
      var tokenMatch2 = (url || "").match(/token=([^&]+)/);
      var contentId2 = tokenMatch2 ? tokenMatch2[1] : "protectcar";
      var eid2 = "atc_" + contentId2 + "_" + Date.now();
      if (typeof window.metaTrack === "function") {
        window.metaTrack("AddToCart", {
          content_type: "product",
          content_ids: [contentId2],
          currency: "EUR",
          num_items: 1
        }, eid2);
      }
    } catch (e) {}
    window.location.href = finalUrl;
  });

  typeButtons.forEach((button) => {
    button.classList.toggle("is-on", button.dataset.tipo === st.tipo);
  });

  colorButtons.forEach((button) => {
    button.classList.toggle("is-on", button.dataset.cor === st.cor);
  });

  textureButtons.forEach((button) => {
    button.classList.toggle("is-on", button.dataset.textura === st.textura);
  });

  resetMarca();
  renderKits();
})();

const specsToggle = document.getElementById("specsToggle");
const specsContent = document.getElementById("specsContent");

if (specsToggle && specsContent) {
  specsToggle.addEventListener("click", () => {
    const opened = specsContent.classList.toggle("is-open");
    specsToggle.textContent = opened ? "Ver menos" : "Ver mais";
    specsToggle.classList.toggle("is-open", opened);
  });
}
// Smooth scroll manual — funciona mesmo com body como scroll container
// (overflow:hidden auto), onde scrollIntoView({behavior:'smooth'}) falha.
// Recalcula o alvo a cada frame: lazy-load de imagens muda a altura da
// página durante o scroll, então um targetY fixo "erra" o destino.
function smoothScrollToEl(el, offset) {
  if (!el) return;
  offset = offset == null ? 120 : offset; // compensa header sticky

  const getY = () => window.pageYOffset
    || document.body.scrollTop
    || document.documentElement.scrollTop || 0;
  // behavior:"instant" é obrigatório — sem ele, o CSS scroll-behavior:smooth
  // transforma cada frame numa animação própria e trava o scroll manual.
  const setY = (y) => {
    try { window.scrollTo({ top: y, behavior: "instant" }); } catch (e) { window.scrollTo(0, y); }
    try { document.body.scrollTo({ top: y, behavior: "instant" }); } catch (e) { document.body.scrollTop = y; }
    try { document.documentElement.scrollTo({ top: y, behavior: "instant" }); } catch (e) { document.documentElement.scrollTop = y; }
  };
  // posição absoluta do elemento no documento, menos o offset do header
  const targetNow = () => Math.max(0, el.getBoundingClientRect().top + getY() - offset);

  // NÃO cortar aqui por prefers-reduced-motion: a máquina do dono do site
  // tem "reduzir movimento" ligado no Windows e o scroll ficava aos saltos.
  // Decisão dele: o deslize tem de ser suave sempre.
  const startY = getY();
  if (Math.abs(targetNow() - startY) < 2) return;

  const duration = 650;
  const t0 = performance.now();
  const ease = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2);
  let done = false;

  // Se o utilizador mexer no scroll a meio, a animação DESISTE. Sem isto os
  // snaps de segurança lá em baixo (300/700/1100/1600 ms) puxavam a página
  // de volta ao destino durante 1,6 s — dava a sensação de scroll preso
  // logo a seguir a escolher o kit, mesmo com a roda do rato a girar.
  let cancelado = false;
  const timers = [];
  const EVENTOS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  const limpar = () => {
    timers.forEach(clearTimeout);
    EVENTOS.forEach(t => window.removeEventListener(t, cancelar));
  };
  function cancelar() {
    cancelado = true;
    done = true;
    limpar();
  }
  EVENTOS.forEach(t => window.addEventListener(t, cancelar, { passive: true }));

  function step(now) {
    if (done || cancelado) return;
    const t = Math.min((now - t0) / duration, 1);
    // alvo recalculado a cada frame — corrige o drift do lazy-load
    const target = targetNow();
    const y = startY + (target - startY) * ease(t);
    setY(y);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      done = true;
      setY(targetNow());
      limpar();
    }
  }
  requestAnimationFrame(step);

  // FALLBACK GARANTIDO via setTimeout — requestAnimationFrame é pausado
  // quando a aba está em background; setTimeout sempre dispara. Esses
  // snaps garantem que o scroll chega ao destino mesmo sem rAF, e também
  // corrigem o drift do lazy-load depois da animação.
  [300, 700, 1100, 1600].forEach((delay) => {
    timers.push(setTimeout(() => {
      if (cancelado) return;            // o utilizador assumiu o controlo
      // se a animação rAF ainda está rodando, deixa ela terminar
      if (!done && delay < 700) return;
      done = true;
      setY(targetNow());
      if (delay === 1600) limpar();
    }, delay));
  });
}
// expõe global pra ser usada também dentro do IIFE do configurador
window.smoothScrollToEl = smoothScrollToEl;

(function bindVslJump() {
  const vslJumpBtn = document.getElementById("vslJumpBtn");
  if (!vslJumpBtn) return;
  vslJumpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // re-query no clique — garante elemento válido mesmo se DOM mudou
    const target = document.getElementById("cta");
    if (target && typeof window.smoothScrollToEl === "function") {
      window.smoothScrollToEl(target, 120);
    } else if (target) {
      target.scrollIntoView({ block: "start" });
    }
  });
})();
function initVehiclePulse(){
  const cards = Array.from(document.querySelectorAll(".vehicleRow"));
  if(cards.length < 2) return;

  if(window.vehiclePulseTimer){
    clearTimeout(window.vehiclePulseTimer);
  }

  let index = 0;
  let stopped = false;

  function pulseNext(){
    if(stopped) return;

    const current = cards[index];
    if(!current) return;

    current.classList.add("is-pulsing");

    setTimeout(() => {
      current.classList.remove("is-pulsing");

      index++;
      const finishedRound = index >= cards.length;

      if(finishedRound){
        index = 0;
      }

      window.vehiclePulseTimer = setTimeout(
        pulseNext,
        finishedRound ? 1800 : 450
      );
    }, 1250);
  }

  cards.forEach(card => {
    card.addEventListener("pointerdown", () => {
      stopped = true;
      clearTimeout(window.vehiclePulseTimer);
      cards.forEach(c => c.classList.remove("is-pulsing"));
    }, { once: true });
  });

  pulseNext();
}
(function initSocialProof(){
  const sp = document.getElementById("social-proof");
  if (!sp) return;

  const spName = document.getElementById("sp-name");
  const spCity = document.getElementById("sp-city");
  const spProd = document.getElementById("sp-product");
  const spImg = document.getElementById("sp-img");
  const spClose = document.getElementById("sp-close");

  if (!spName || !spCity || !spProd) return;

  const NAMES = [
    "Ana", "Bruno", "Carlos", "Catarina", "Diogo", "Eduardo", "Filipe", "Inês",
    "Henrique", "Joana", "João", "Leonor", "Lucas", "Mariana", "Martim", "Marta",
    "Miguel", "Nuno", "Ricardo", "Sofia", "Tiago", "Tomás", "Beatriz", "Pedro"
  ];

  const LASTNAMES = [
    "Silva", "Santos", "Oliveira", "Ferreira", "Pereira", "Costa",
    "Rodrigues", "Martins", "Almeida", "Ribeiro", "Carvalho", "Gonçalves"
  ];

  const CITIES = [
    "Lisboa",
    "Porto",
    "Braga",
    "Coimbra",
    "Aveiro",
    "Faro",
    "Sintra",
    "Cascais",
    "Vila Nova de Gaia",
    "Setúbal",
    "Funchal",
    "Almada",
    "Portimão",
    "Guimarães",
    "Viseu",
    "Évora"
  ];

  const DB = [
    { marca: "Fiat", modelos: ["500", "Punto", "Tipo", "Panda", "Bravo", "Stilo", "Ducato", "Scudo"] },
    { marca: "Volkswagen", modelos: ["Golf", "Polo", "T-Roc", "Tiguan", "Passat", "Caddy", "Taigo"] },
    { marca: "Renault", modelos: ["Clio", "Megane", "Captur", "Kadjar", "Austral", "Talisman", "Twingo"] },
    { marca: "Peugeot", modelos: ["208", "308", "2008", "3008", "5008", "508", "Partner"] },
    { marca: "Citroën", modelos: ["C3", "C4", "C4 Cactus", "C5 Aircross", "Berlingo", "Jumpy"] },
    { marca: "Toyota", modelos: ["Corolla", "Yaris", "C-HR", "RAV4", "Hilux", "Land Cruiser"] },
    { marca: "Honda", modelos: ["Civic", "Jazz", "CR-V", "HR-V", "Accord"] },
    { marca: "Hyundai", modelos: ["i20", "i30", "Tucson", "Santa Fe", "Kona", "Bayon"] },
    { marca: "Kia", modelos: ["Picanto", "Rio", "Sportage", "Ceed", "Stonic", "Niro"] },
    { marca: "Nissan", modelos: ["Micra", "Qashqai", "Juke", "X-Trail", "Navara", "Leaf"] },
    { marca: "BMW", modelos: ["Série 1", "Série 2", "Série 3", "X1", "X3", "X5"] },
    { marca: "Mercedes-Benz", modelos: ["Classe A", "Classe C", "GLA", "GLC", "Vito"] },
    { marca: "Audi", modelos: ["A1", "A3", "A4", "Q2", "Q3", "Q5"] }
  ];

  /* Fotos da notificação. Só ficheiros que existem e são leves — a
     miniatura tem 44px, não vale a pena carregar um banner de 2 MB. */
  const FOTOS_NOTIF = ["images/prod1.webp", "images/foto1.webp", "images/tapetebom.webp"];

  const YEARS = ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];
  const COLORS = ["Preto", "Cinza", "Bege"];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const fullName = () => `${rand(NAMES)} ${rand(LASTNAMES)}`;

  /* "Polestar" + "Polestar 2" → "Polestar 2" (e não "Polestar Polestar 2").
     Compara sem acentos nem maiúsculas para apanhar "Citroën"/"citroen". */
  function nomeVeiculo(marca, modelo){
    const normaliza = s => (s || '')
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]/g, '');
    const m = normaliza(marca);
    return (m && normaliza(modelo).startsWith(m)) ? modelo : `${marca} ${modelo}`;
  }

  function buildProductText(){
    const selectedBrand =
      document.getElementById("rvTxtMarca")?.textContent?.trim() || "";

    const selectedModel =
      document.getElementById("rvTxtModelo")?.textContent?.trim() || "";

    const selectedYear =
      document.getElementById("rvTxtAno")?.textContent?.trim() || "";

    const selectedColorBtn = document.querySelector(".rvColor.is-on");
    const selectedColor =
      selectedColorBtn?.dataset?.cor === "preto" ? "Preto" :
      selectedColorBtn?.dataset?.cor === "cinza" ? "Cinza" :
      selectedColorBtn?.dataset?.cor === "bege"  ? "Bege"  : "";

    const selectedKitEl = document.querySelector(".rvKitCard.is-on .rvKitCard__title");
    const selectedKit = selectedKitEl?.textContent?.trim() || "";

    const hasBrand = selectedBrand && !/selecionar|aguardando/i.test(selectedBrand);
    const hasModel = selectedModel && !/selecionar|aguardando/i.test(selectedModel);
    const hasYear  = selectedYear  && !/selecionar|aguardando/i.test(selectedYear);
    const hasColor = !!selectedColor;
    const hasKit   = !!selectedKit;

    if (hasBrand && hasModel) {
      const parts = [];

      if (hasKit) parts.push(selectedKit);
      else parts.push("Tapete Bandeja 3D");

      /* Modelos como "Polestar 2", "MG4" ou "Mazda2" já trazem a marca no nome —
         sem isto sairia "Polestar Polestar 2 (Elétrico)". */
      parts.push(nomeVeiculo(selectedBrand, selectedModel));

      if (hasYear) parts.push(`(${selectedYear})`);
      if (hasColor) parts.push(`• Cor ${selectedColor}`);

      return parts.join(" ");
    }

    const pick = rand(DB);
    const modelo = rand(pick.modelos);
    const ano = rand(YEARS);
    const cor = rand(COLORS);
    const tipoKit = Math.random() > 0.5
      ? "Tapete Bandeja 3D"
      : "Kit Interno + Mala";

    return `${tipoKit} • ${pick.marca} ${modelo} (${ano}) • Cor ${cor}`;
  }

  let hideTimer = null;
  let showTimer = null;
  let manuallyClosed = false;

  function show(payload){
    if (manuallyClosed) return;

    spName.textContent = payload.name;
    spCity.textContent = payload.city;
    spProd.textContent = payload.product;
    /* Rede de segurança: se a foto falhar (ficheiro em falta, offline,
       bloqueador), a notificação sai só com texto em vez de mostrar o
       ícone de imagem partida. */
    if (spImg) {
      const caixa = spImg.closest(".rvSocialProof__thumbWrap") || spImg;
      caixa.hidden = false;
      spImg.onerror = () => { caixa.hidden = true; };
      spImg.onload  = () => { caixa.hidden = false; };
      spImg.src = payload.image;
    }

    sp.classList.add("is-show");

    /* Fica no ecrã tempo suficiente para se ler sem pressa (o texto do
       produto é comprido). Antes eram 4,2s — saía a correr. */
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      sp.classList.remove("is-show");
    }, 7000);
  }

  function hide(){
    sp.classList.remove("is-show");
    clearTimeout(hideTimer);
  }

  function scheduleNext(){
    if (manuallyClosed) return;

    clearTimeout(showTimer);

    /* Intervalo entre notificações: 26–46s (antes 9–18s, demasiado seguido).
       O tempo conta a partir do fim da anterior, por isso o silêncio real
       entre elas é este valor menos os 7s que a notificação está visível. */
    const delay = Math.floor(Math.random() * 20000) + 26000;

    showTimer = setTimeout(() => {
      show({
        name: fullName(),
        city: rand(CITIES),
        product: buildProductText(),
        image: rand(FOTOS_NOTIF)
      });
      scheduleNext();
    }, delay);
  }

  spClose?.addEventListener("click", () => {
    manuallyClosed = true;
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hide();
  });

  setTimeout(() => {
    show({
      name: fullName(),
      city: rand(CITIES),
      product: buildProductText(),
      image: rand(FOTOS_NOTIF)
    });
    scheduleNext();
    /* A primeira só aos 15s — dá tempo de ver a página antes de a interromper. */
  }, 15000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      hide();
    } else if (!manuallyClosed) {
      scheduleNext();
    }
  });
})();
