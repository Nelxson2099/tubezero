// TubeZero - Popup Logic

document.addEventListener('DOMContentLoaded', () => {
  const statShorts = document.getElementById('statShorts');
  const statTimeSaved = document.getElementById('statTimeSaved');
  const statVideosToday = document.getElementById('statVideosToday');
  const statVideosYesterday = document.getElementById('statVideosYesterday');

  const checkHome = document.getElementById('checkHome');
  const checkShorts = document.getElementById('checkShorts');
  const checkSidebar = document.getElementById('checkSidebar');
  const checkComments = document.getElementById('checkComments');
  const checkEndscreen = document.getElementById('checkEndscreen');
  const checkNotifications = document.getElementById('checkNotifications');

  const presetButtons = document.querySelectorAll('.tz-preset-btn');
  const btnReset = document.getElementById('btnReset');

  function formatMinutes(mins) {
    if (!mins || mins === 0) return '0m';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
  }

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

  // Load from chrome.storage
  chrome.storage.local.get(
    [
      'blockHome',
      'blockShorts',
      'blockSidebar',
      'blockComments',
      'blockEndscreen',
      'blockNotifications',
      'statsShortsBlocked',
      'statsTimeSavedMinutes',
      'todayVideosCount',
      'yesterdayVideosCount',
      'videosDate',
      'preset'
    ],
    (res) => {
      if (checkHome) checkHome.checked = res.blockHome !== false;
      if (checkShorts) checkShorts.checked = res.blockShorts !== false;
      if (checkSidebar) checkSidebar.checked = res.blockSidebar !== false;
      if (checkComments) checkComments.checked = !!res.blockComments;
      if (checkEndscreen) checkEndscreen.checked = res.blockEndscreen !== false;
      if (checkNotifications) checkNotifications.checked = !!res.blockNotifications;

      if (statShorts) statShorts.textContent = res.statsShortsBlocked || 0;
      if (statTimeSaved) statTimeSaved.textContent = formatMinutes(res.statsTimeSavedMinutes || 0);

      // Verificación de rotación diaria (Hoy vs Ayer)
      const todayStr = getLocalDateString();
      const yesterdayStr = getYesterdayDateString();

      let todayCount = res.todayVideosCount || 0;
      let yesterdayCount = res.yesterdayVideosCount || 0;
      let savedDate = res.videosDate || '';

      if (savedDate !== todayStr) {
        if (savedDate === yesterdayStr) {
          yesterdayCount = todayCount;
        } else {
          yesterdayCount = 0;
        }
        todayCount = 0;
        savedDate = todayStr;
        chrome.storage.local.set({
          todayVideosCount: 0,
          yesterdayVideosCount: yesterdayCount,
          videosDate: todayStr
        });
      }

      if (statVideosToday) statVideosToday.textContent = todayCount;
      if (statVideosYesterday) statVideosYesterday.textContent = yesterdayCount;

      updatePresetUI(res.preset || 'study');
    }
  );

  function saveSetting(key, val) {
    const update = {};
    update[key] = val;
    chrome.storage.local.set(update);
  }

  // Attach change listeners
  if (checkHome) checkHome.addEventListener('change', (e) => saveSetting('blockHome', e.target.checked));
  if (checkShorts) checkShorts.addEventListener('change', (e) => saveSetting('blockShorts', e.target.checked));
  if (checkSidebar) checkSidebar.addEventListener('change', (e) => saveSetting('blockSidebar', e.target.checked));
  if (checkComments) checkComments.addEventListener('change', (e) => saveSetting('blockComments', e.target.checked));
  if (checkEndscreen) checkEndscreen.addEventListener('change', (e) => saveSetting('blockEndscreen', e.target.checked));
  if (checkNotifications) checkNotifications.addEventListener('change', (e) => saveSetting('blockNotifications', e.target.checked));

  // Presets handling
  function applyPreset(name) {
    let settings = {};
    if (name === 'monk') {
      settings = {
        blockHome: true,
        blockShorts: true,
        blockSidebar: true,
        blockComments: true,
        blockEndscreen: true,
        blockNotifications: true,
        preset: 'monk'
      };
    } else if (name === 'study') {
      settings = {
        blockHome: true,
        blockShorts: true,
        blockSidebar: true,
        blockComments: false,
        blockEndscreen: true,
        blockNotifications: false,
        preset: 'study'
      };
    } else {
      settings = { preset: 'custom' };
    }

    chrome.storage.local.set(settings, () => {
      if (checkHome) checkHome.checked = settings.blockHome !== undefined ? settings.blockHome : checkHome.checked;
      if (checkShorts) checkShorts.checked = settings.blockShorts !== undefined ? settings.blockShorts : checkShorts.checked;
      if (checkSidebar) checkSidebar.checked = settings.blockSidebar !== undefined ? settings.blockSidebar : checkSidebar.checked;
      if (checkComments) checkComments.checked = settings.blockComments !== undefined ? settings.blockComments : checkComments.checked;
      if (checkEndscreen) checkEndscreen.checked = settings.blockEndscreen !== undefined ? settings.blockEndscreen : checkEndscreen.checked;
      if (checkNotifications) checkNotifications.checked = settings.blockNotifications !== undefined ? settings.blockNotifications : checkNotifications.checked;
      updatePresetUI(name);
    });
  }

  function updatePresetUI(name) {
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === name);
    });
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.getAttribute('data-preset'));
    });
  });

  // Reset to default
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      applyPreset('study');
    });
  }
});
