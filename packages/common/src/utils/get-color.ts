import Color from 'color';

export function getColorInstance(color: string) {
  // Color('#ff000033') throws invalid color error.
  const colorWithOpacity = color.length === 9;

  if (colorWithOpacity) {
    // remove the opacity
    return Color(color.slice(0, -2));
  }

  return Color(color);
}
