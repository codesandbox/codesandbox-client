import { TextOperation } from 'ot';
import { transform } from './transform';

it('works', () => {
  const op = TextOperation.fromJSON([384, '"primaraa"', -9, 177]);
  console.log(transform(op, [384, 393]));
});

it('works2', () => {
  const op = TextOperation.fromJSON([-1, 'aa', 1]);
  console.log(transform(op, [0, 1]));
});
