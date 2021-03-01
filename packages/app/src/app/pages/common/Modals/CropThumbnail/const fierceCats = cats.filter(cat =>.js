const fierceCats = cats.filter(cat => cat.personality === 'fierce');

const fierceCats = cats.filter(cat => {
  // will return true or false
  return cat.personality === 'fierce';
});
