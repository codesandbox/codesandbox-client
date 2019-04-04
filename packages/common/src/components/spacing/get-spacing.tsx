export type Options = {
  margin?: number;
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
  horizontal?: number;
  vertical?: number;
};

export default function({
  margin,
  top,
  right,
  left,
  bottom,
  horizontal,
  vertical,
}: Options) {
  const topMargin = [top, vertical, margin].find(s => s != null) || 0;
  const rightMargin = [right, horizontal, margin].find(s => s != null) || 0;
  const bottomMargin = [bottom, vertical, margin].find(s => s != null) || 0;
  const leftMargin = [left, horizontal, margin].find(s => s != null) || 0;

  return `${topMargin}rem ${rightMargin}rem ${bottomMargin}rem ${leftMargin}rem`;
}
