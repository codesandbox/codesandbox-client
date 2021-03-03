import { IReaction } from 'overmind';
import { Context } from '..';

export default (() => {
  let _reaction: IReaction<Context>;

  return {
    initialize(reaction: IReaction<Context>) {
      _reaction = reaction;
    },
    waitUntil(test: (state: Context['state']) => boolean): Promise<void> {
      return new Promise(resolve => {
        _reaction(test, bool => {
          if (bool === true) {
            resolve();
          }
        });
      });
    },
  };
})();
