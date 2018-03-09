// @flow
import configs from './';

import prettierUI from './prettierRC/ui';
import sandboxUI from './sandbox/ui';

export default function getUI(configType: string) {
  switch (configType) {
    case configs.prettier.type: {
      return prettierUI;
    }
    case configs.sandbox.type: {
      return sandboxUI;
    }
    default: {
      return null;
    }
  }
}
