// TubeZero - Background Service Worker (Ultra-lightweight)

const DEFAULT_SETTINGS = {
  blockHome: true,
  blockShorts: true,
  redirectShorts: true,
  blockSidebar: true,
  blockComments: false,
  blockEndscreen: true,
  blockNotifications: false,
  statsShortsBlocked: 0,
  statsTimeSavedMinutes: 0,
  preset: 'study',
  temporaryUnblockUntil: 0,
  todayVideosCount: 0,
  yesterdayVideosCount: 0,
  videosDate: '',
  lastWatchedVideoId: ''
};

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

function registerVideoWatch(videoId, sendResponse) {
  if (!videoId || typeof videoId !== 'string') return;
  const cleanId = videoId.trim();
  if (!cleanId) return;

  chrome.storage.local.get(
    ['todayVideosCount', 'yesterdayVideosCount', 'videosDate', 'lastWatchedVideoId'],
    (res) => {
      const todayStr = getLocalDateString();
      const yesterdayStr = getYesterdayDateString();

      let todayCount = parseInt(res.todayVideosCount, 10) || 0;
      let yesterdayCount = parseInt(res.yesterdayVideosCount, 10) || 0;
      let savedDate = res.videosDate || '';
      let lastId = res.lastWatchedVideoId || '';

      // Si es exactamente el mismo video ya registrado, no duplicar conteo
      if (cleanId === lastId) {
        if (sendResponse) sendResponse({ status: 'already_counted', todayCount, yesterdayCount });
        return;
      }

      // Si cambió de fecha (ej: sábado a domingo)
      if (savedDate !== todayStr) {
        if (savedDate === yesterdayStr) {
          yesterdayCount = todayCount;
        } else {
          yesterdayCount = 0;
        }
        todayCount = 0;
        savedDate = todayStr;
      }

      todayCount += 1;
      lastId = cleanId;

      chrome.storage.local.set({
        todayVideosCount: todayCount,
        yesterdayVideosCount: yesterdayCount,
        videosDate: savedDate,
        lastWatchedVideoId: lastId
      }, () => {
        if (sendResponse) sendResponse({ status: 'ok', todayCount, yesterdayCount });
      });
    }
  );
}

// 1. Detección nativa por pestañas del navegador (funciona al instante sin recargar la pestaña)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const targetUrl = changeInfo.url || (tab && tab.url);
  if (!targetUrl || !targetUrl.includes('youtube.com/watch')) return;

  try {
    const urlObj = new URL(targetUrl);
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      registerVideoWatch(videoId);
    }
  } catch (e) {}
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (res) => {
    const updates = {};
    for (const key in DEFAULT_SETTINGS) {
      if (res[key] === undefined) {
        updates[key] = DEFAULT_SETTINGS[key];
      }
    }
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
});

// 2. Detección por mensajes desde content script & gestión de shorts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'register_video_watch') {
    registerVideoWatch(message.videoId, sendResponse);
    return true;
  }

  if (message.action === 'increment_shorts_blocked') {
    chrome.storage.local.get(['statsShortsBlocked', 'statsTimeSavedMinutes'], (res) => {
      const currentShorts = (res.statsShortsBlocked || 0) + 1;
      // Cada Short bloqueado salva aprox 3 minutos de doomscroll
      const timeSaved = Math.round(currentShorts * 3);
      chrome.storage.local.set({
        statsShortsBlocked: currentShorts,
        statsTimeSavedMinutes: timeSaved
      });
      sendResponse({ status: 'ok', count: currentShorts });
    });
    return true;
  }
  
  if (message.action === 'get_settings') {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (res) => {
      sendResponse(res);
    });
    return true;
  }
});
