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

// Checks both rgb and hex colors for contrast and returns true if the color is in the dark spectrum
export const isDarkColor = (color: string) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (color.startsWith('#')) {
    if (color.length < 7) {
      return true;
    }

    r = parseInt(color.substr(1, 2), 16);
    g = parseInt(color.substr(3, 2), 16);
    b = parseInt(color.substr(5, 2), 16);
  } else {
    const rgbValues = color
      .replace('rgb(', '')
      .replace('rgba(', '')
      .replace(')', '')
      .split(',');
    if (rgbValues.length < 3) {
      return true;
    }

    r = parseInt(rgbValues[0], 10);
    g = parseInt(rgbValues[1], 10);
    b = parseInt(rgbValues[2], 10);
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

export const generateRandomId = () =>
  Math.floor(Math.random() * 10000).toString();
