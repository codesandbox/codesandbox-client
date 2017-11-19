export default function({
  margin,
  top,
  right,
  left,
  bottom,
  horizontal,
  vertical,
}) {
  const topMargin = top || vertical || margin || 0;
  const rightMargin = right || horizontal || margin || 0;
  const bottomMargin = bottom || vertical || margin || 0;
  const leftMargin = left || horizontal || margin || 0;

  return `${topMargin}rem ${rightMargin}rem ${bottomMargin}rem ${leftMargin}rem`;
}
