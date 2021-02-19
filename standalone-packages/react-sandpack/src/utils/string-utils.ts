export const getFileName = (filePath: string) => {
  const lastIndexOfSlash = filePath.lastIndexOf('/');
  return filePath.slice(lastIndexOfSlash + 1);
};

export const hexToRGB = (hex: string) => {
  let r = '0';
  let g = '0';
  let b = '0';

  if (hex.length === 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }

  return {
    red: +r,
    green: +g,
    blue: +b,
  };
};

export const hexToCSSRGBa = (hex: string, alpha: number) => {
  if (hex.startsWith('#') && (hex.length === 4 || hex.length === 7)) {
    const { red, green, blue } = hexToRGB(hex);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return hex;
};
