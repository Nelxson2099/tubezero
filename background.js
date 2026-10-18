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
  temporaryUnblockUntil: 0
};

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
  
  if (message.action === 'get_settings') {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (res) => {
      sendResponse(res);
    });
    return true;
  }
});
