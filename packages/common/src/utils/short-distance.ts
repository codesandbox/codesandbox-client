export const shortDistance = distance =>
  // we remove long names for short letters
  distance
    .replace(' years', 'y')
    .replace(' year', 'y')
    .replace(' months', 'mo')
    .replace(' month', 'mo')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' minutes', 'min')
    .replace(' minute', 'min')
    .replace(' seconds', 's')
    .replace(' second', 's');
