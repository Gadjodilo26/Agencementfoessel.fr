(function () {
  const VERSION_META = document.querySelector('meta[name="asset-version"]');
  const VERSION = VERSION_META ? VERSION_META.getAttribute('content') : '';
  if (!VERSION) return;

  const STORAGE_KEY = 'af-cache-version';
  const SESSION_FLAG = 'af-cache-version-applied';
  const resources = () => Array.from(document.querySelectorAll('[data-cache-bust]'));

  const applyVersion = () => {
    resources().forEach((el) => {
      const attr = el.tagName === 'LINK' ? 'href' : 'src';
      const current = el.getAttribute(attr);
      if (!current) return;
      const url = new URL(current, window.location.origin);
      if (url.searchParams.get('v') === VERSION) return;
      url.searchParams.set('v', VERSION);
      el.setAttribute(attr, url.pathname + url.search);
    });
  };

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== VERSION) {
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
    }
    window.localStorage.setItem(STORAGE_KEY, VERSION);
    applyVersion();
    window.sessionStorage.setItem(SESSION_FLAG, VERSION);
    return;
  }

  const applied = window.sessionStorage.getItem(SESSION_FLAG);
  if (applied !== VERSION) {
    applyVersion();
    window.sessionStorage.setItem(SESSION_FLAG, VERSION);
  }
})();
