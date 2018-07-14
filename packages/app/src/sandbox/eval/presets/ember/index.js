import { join, absolute } from 'common/utils/path';
import Preset from '../';

export default function initialize() {
  const preset = new Preset(
    'ember',
    ['ts', 'js', 'hbs', 'json'],
    {},
    {
      setup: async manager => {
        // TODO: fill this out
      }
    },
  );

  // TODO:
  //   do I need to register transpilers
  //   when ember-cli does all this for us?

  return preset;
}
