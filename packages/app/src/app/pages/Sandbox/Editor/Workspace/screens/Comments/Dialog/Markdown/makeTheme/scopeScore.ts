const scorePerScope = {
  builtin: ['variable.other.constant', 'constant.language'],
  punctuation: ['punctuation.accessor'],
  tag: ['meta.tag.html', 'entity.name.tag'],
};

// The higher the better
const score = [
  // These are sure matches
  'markup', // diffs
  'comment',
  'punctuation',
  'string',
  'variable',

  // These are more "meta" scopes
  'meta', // good guesses
  'entity',
  'constant',
  'support',
  'variable',
];

const baseScoreSize = score.length;

export const getScoreForScope = (scope, mappedScope) => {
  // Get scores for specific mapped scopes first
  const scoreForMapped = scorePerScope[mappedScope];
  if (scoreForMapped) {
    // If the scope is in the specific mapped scope we add the baseScoreSize to this
    // score
    const mappedIndex = scoreForMapped.findIndex(x => scope.startsWith(x));
    if (mappedIndex !== -1) {
      return baseScoreSize + (scoreForMapped.length - mappedIndex);
    }
  }

  const parentScope = scope.split('.')[0];
  const index = score.indexOf(parentScope);

  if (index === -1) {
    // Otherwise it's a negative score based on length
    return -1 * scope.length;
  }

  // If it's found we return the score from the main `score` arr
  return baseScoreSize - index;
};
