type PluralOptions = {
  count: number;
  word: string;
  suffixSingular?: string;
  suffixPlural?: string;
};
export const pluralize = ({
  count,
  word,
  suffixSingular = '',
  suffixPlural = 's',
}: PluralOptions) => `${word}${count === 1 ? suffixSingular : suffixPlural}`;
