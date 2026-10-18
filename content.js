// TubeZero - Content Engine for YouTube
// Runs at document_start for instant zero-flicker protection

(function() {
  'use strict';

  let currentSettings = {
    blockHome: true,
    blockShorts: true,
    redirectShorts: true,
    blockSidebar: true,
    blockComments: false,
    blockEndscreen: true,
    blockNotifications: false,
    temporaryUnblockUntil: 0
  };

  const QUOTES = [
    { text: "Tu atención es tu recurso más valioso. No se la regales a un algoritmo.", author: "Enfoque Profundo" },
    { text: "No es que tengamos poco tiempo, sino que perdemos mucho.", author: "Séneca" },
    { text: "La concentración profunda es el superpoder del siglo XXI.", author: "Cal Newport" },
    { text: "Dile 'no' a cien cosas buenas para poder decir 'sí' a las pocas que importan.", author: "Steve Jobs" },
    { text: "El conocimiento real exige deliberación, no desplazamiento infinito.", author: "TubeZero Mindset" }
  ];

  // 1. Instant root class application
  function applyClasses() {
    const root = document.documentElement;
    const now = Date.now();
    const isTempUnblocked = (currentSettings.temporaryUnblockUntil || 0) > now;

    if (currentSettings.blockHome && !isTempUnblocked) {
      root.classList.add('tz-block-home');
    } else {
      root.classList.remove('tz-block-home');
    }

    if (currentSettings.blockShorts) {
      root.classList.add('tz-block-shorts');
    } else {
      root.classList.remove('tz-block-shorts');
    }

    if (currentSettings.blockSidebar) {
      root.classList.add('tz-block-sidebar');
    } else {
      root.classList.remove('tz-block-sidebar');
    }

    if (currentSettings.blockComments) {
      root.classList.add('tz-block-comments');
    } else {
      root.classList.remove('tz-block-comments');
    }

    if (currentSettings.blockEndscreen) {
      root.classList.add('tz-block-endscreen');
    } else {
      root.classList.remove('tz-block-endscreen');
    }

    if (currentSettings.blockNotifications) {
      root.classList.add('tz-block-notifications');
    } else {
      root.classList.remove('tz-block-notifications');
    }
  }

  // Load settings immediately
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(
      [
        'blockHome',
        'blockShorts',
        'redirectShorts',
        'blockSidebar',
        'blockComments',
        'blockEndscreen',
        'blockNotifications',
        'temporaryUnblockUntil'
      ],
      (res) => {
        if (res) {
          Object.assign(currentSettings, res);
          applyClasses();
          handleRoute();
        }
      }
    );

    // Listen to setting changes in real time
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        for (const key in changes) {
          currentSettings[key] = changes[key].newValue;
        }
        applyClasses();
        handleRoute();
      }
    });
  }

  // 2. Shorts auto-redirection
  function checkShortsRedirect() {
    if (!currentSettings.blockShorts || !currentSettings.redirectShorts) return;
    const path = window.location.pathname;
    const match = path.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const videoId = match[1];
      try {
        chrome.runtime.sendMessage({ action: 'increment_shorts_blocked' });
      } catch (e) {}
      window.location.replace('/watch?v=' + videoId);
    }
  }

  // 3. Zen Hero Homepage Search UI
  function renderZenHero() {
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    const now = Date.now();
    const isTempUnblocked = (currentSettings.temporaryUnblockUntil || 0) > now;

    if (!isHome || !currentSettings.blockHome || isTempUnblocked) {
      const existing = document.getElementById('tubezero-zen-container');
      if (existing) existing.remove();
      return;
    }

    if (document.getElementById('tubezero-zen-container')) return;

    // Pick random quote
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    const container = document.createElement('div');
    container.id = 'tubezero-zen-container';
    container.innerHTML = `
      <div class="tz-hero-badge">
        <span class="tz-hero-badge-dot"></span>
        <span>TubeZero Focus</span>
      </div>
      <h1 class="tz-hero-title">¿Qué viniste a dominar hoy?</h1>
      <p class="tz-hero-subtitle">El algoritmo está silenciado. Busca con intención lo que deseas aprender.</p>

      <form class="tz-search-wrapper" id="tz-search-form">
        <input type="text" class="tz-search-input" id="tz-search-input" placeholder="Buscar conferencias, cursos, temas..." autocomplete="off" />
        <button type="submit" class="tz-search-btn" title="Buscar en YouTube">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      <div class="tz-intent-links">
        <a class="tz-intent-pill" href="/feed/subscriptions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          Suscripciones
        </a>
        <a class="tz-intent-pill" href="/playlist?list=WL">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Ver más tarde
        </a>
        <a class="tz-intent-pill" href="/feed/history">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><path d="M12 7v5l4 2"></path></svg>
          Historial
        </a>
        <span class="tz-intent-pill" data-search="Programacion y Arquitectura de Software">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          Programación
        </span>
        <span class="tz-intent-pill" data-search="Documentales Ciencia Tecnologia">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Documentales
        </span>
        <span class="tz-intent-pill" data-search="Deep Work Lo-Fi Focus Music">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          Música Focus
        </span>
      </div>

      <div class="tz-quote-box">
        <p class="tz-quote-text">"${quote.text}"</p>
        <span class="tz-quote-author">— ${quote.author}</span>
      </div>

      <button type="button" class="tz-unblock-trigger" id="tz-temp-unblock-btn">
        ¿Necesitas ver el feed? Pausa consciente de 10 min
      </button>
    `;

    // Try finding YouTube's primary container or body
    const primary = document.querySelector('ytd-browse[page-subtype="home"] #primary') || 
                    document.querySelector('ytd-browse[page-subtype="home"]') || 
                    document.querySelector('ytd-page-manager') || 
                    document.body;

    if (primary) {
      primary.prepend(container);
    }

    // Bind events
    const form = container.querySelector('#tz-search-form');
    const input = container.querySelector('#tz-search-input');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          window.location.href = `/results?search_query=${encodeURIComponent(query)}`;
        }
      });
      // Auto focus input
      setTimeout(() => input.focus(), 150);
    }

    // Quick tag search
    container.querySelectorAll('.tz-intent-pill[data-search]').forEach((pill) => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-search');
        window.location.href = `/results?search_query=${encodeURIComponent(query)}`;
      });
    });

    // Temp unblock button
    const unblockBtn = container.querySelector('#tz-temp-unblock-btn');
    if (unblockBtn) {
      unblockBtn.addEventListener('click', () => {
        const tenMinutesLater = Date.now() + 10 * 60 * 1000;
        chrome.storage.local.set({ temporaryUnblockUntil: tenMinutesLater }, () => {
          showToast('Feed temporal activado por 10 minutos');
        });
      });
    }
  }

  // 4. Micro-Toast Notification
  function showToast(text) {
    let toast = document.getElementById('tubezero-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tubezero-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg class="tz-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><polygon points="10,8 16,12 10,16" fill="currentColor"/></svg>
      <span>${text}</span>
    `;
    toast.classList.add('tz-toast-visible');
    setTimeout(() => {
      toast.classList.remove('tz-toast-visible');
    }, 2200);
  }

  // 5. Keyboard shortcut: Alt + Z (Toggle Focus Mode)
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
      const newSidebarState = !currentSettings.blockSidebar;
      currentSettings.blockSidebar = newSidebarState;
      currentSettings.blockComments = newSidebarState;
      chrome.storage.local.set({
        blockSidebar: newSidebarState,
        blockComments: newSidebarState
      }, () => {
        showToast(newSidebarState ? 'TubeZero: Modo Enfoque Activado' : 'TubeZero: Modo Enfoque Pausado');
      });
    }
  });

  // 6. SPA Routing & Lifecycle
  let currentWatchedVideoId = '';

  function checkVideoWatch() {
    const path = window.location.pathname;
    if (path === '/watch') {
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('v');
      if (videoId && videoId !== currentWatchedVideoId) {
        currentWatchedVideoId = videoId;
        try {
          chrome.runtime.sendMessage({
            action: 'register_video_watch',
            videoId: videoId
          });
        } catch (e) {}
      }
    }
  }

  function handleRoute() {
    checkShortsRedirect();
    checkVideoWatch();
    autoSkipAds();
    renderZenHero();
  }

  // Events for YouTube SPA
  window.addEventListener('yt-navigate-finish', handleRoute);
  window.addEventListener('yt-page-data-updated', handleRoute);
  window.addEventListener('popstate', handleRoute);
  document.addEventListener('DOMContentLoaded', handleRoute);

  
  // 7. Stealth Ad Auto-Skipper (Backup for Brave / Chromium)
  function autoSkipAds() {
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
    if (skipBtn) {
      skipBtn.click();
    }
    const adOverlay = document.querySelector('.ytp-ad-overlay-close-button');
    if (adOverlay) {
      adOverlay.click();
    }
  }

  // Fallback poller for dynamically rendered elements
  setInterval(() => {
    checkShortsRedirect();
    checkVideoWatch();
    autoSkipAds();
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    if (isHome && currentSettings.blockHome && !document.getElementById('tubezero-zen-container')) {
      renderZenHero();
    }
  }, 1000);

})();
