export const nicifyName = (s: string) => {
  const [firstChar, ...rest] = s.split('');

  return [firstChar.toUpperCase(), ...rest]
    .join('')
    .split(/(?=[A-Z])/g)
    .join(' ');
};
