export const getContrastYIQ = (hex: Function | string) => {
  const color = typeof hex === 'function' ? hex() : hex;
  const cleanColor = color.split('#')[1];
  const r = parseInt(cleanColor.substr(0, 2), 16);
  const g = parseInt(cleanColor.substr(2, 2), 16);
  const b = parseInt(cleanColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq;
};
