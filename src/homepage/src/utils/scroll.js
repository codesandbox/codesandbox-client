export default function getScrollPos() {
  if (window.pageYOffset !== undefined) {
    return { x: pageXOffset, y: pageYOffset };
  }

  const d = document;
  const r = d.documentElement;
  const b = d.body;
  const sx = r.scrollLeft || b.scrollLeft || 0;
  const sy = r.scrollTop || b.scrollTop || 0;
  return { x: sx, y: sy };
}
