import { ResolveState } from 'overmind';
import { Reaction, Config } from '..';

export default (() => {
  let _reaction: Reaction;

  return {
    initialize(reaction: Reaction) {
      _reaction = reaction;
    },
    waitUntil(
      test: (state: ResolveState<Config['state']>) => boolean
    ): Promise<boolean> {
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
