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

// Message listener for stats and actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

  if (message.action === 'register_video_watch') {
    chrome.storage.local.get(
      ['todayVideosCount', 'yesterdayVideosCount', 'videosDate', 'lastWatchedVideoId'],
      (res) => {
        const todayStr = getLocalDateString();
        const yesterdayStr = getYesterdayDateString();

        let todayCount = res.todayVideosCount || 0;
        let yesterdayCount = res.yesterdayVideosCount || 0;
        let savedDate = res.videosDate || '';
        let lastId = res.lastWatchedVideoId || '';

        // Comprobar si cambió el día (ej: sábado a domingo)
        if (savedDate !== todayStr) {
          if (savedDate === yesterdayStr) {
            yesterdayCount = todayCount;
          } else {
            // Pasaron 2 o más días sin registrar
            yesterdayCount = 0;
          }
          todayCount = 0;
          savedDate = todayStr;
          lastId = '';
        }

        // Solo incrementar si es un video nuevo (evita spam al pausar/adelantar)
        if (message.videoId && message.videoId !== lastId) {
          todayCount += 1;
          lastId = message.videoId;
        }

        chrome.storage.local.set({
          todayVideosCount: todayCount,
          yesterdayVideosCount: yesterdayCount,
          videosDate: savedDate,
          lastWatchedVideoId: lastId
        }, () => {
          sendResponse({ status: 'ok', todayCount, yesterdayCount });
        });
      }
    );
    return true;
  }
  
  if (message.action === 'get_settings') {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (res) => {
      sendResponse(res);
    });
    return true;
  }
});
