import { isValidTagName } from './html-writer';

it('Should be able to filter out invalid tag names', () => {
  expect(isValidTagName('a')).toBe(true);
  expect(isValidTagName('-span')).toBe(false);
  expect(isValidTagName('div-')).toBe(false);
  expect(isValidTagName('custom-tag')).toBe(true);
  expect(isValidTagName('%=')).toBe(false);
  expect(isValidTagName('div')).toBe(true);
  expect(isValidTagName('__IgEyE-EbwyE__')).toBe(true);
  expect(isValidTagName('_f_')).toBe(true);
  expect(isValidTagName('-span-')).toBe(false);
});
