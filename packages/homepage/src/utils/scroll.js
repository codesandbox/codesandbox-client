let cache = null;

export default function getScrollPos(now = Date.now(), useCache = true) {
  if (useCache && cache && now - cache.now < 100) {
    return cache.result;
  }

  if (window.pageYOffset !== undefined) {
    cache = {
      now,
      result: { x: pageXOffset, y: pageYOffset },
    };
    return cache.result;
  }

  const d = document;
  const r = d.documentElement;
  const b = d.body;
  const sx = r.scrollLeft || b.scrollLeft || 0;
  const sy = r.scrollTop || b.scrollTop || 0;

  cache = {
    now,
    result: { x: sx, y: sy },
  };
  return cache.result;
}
