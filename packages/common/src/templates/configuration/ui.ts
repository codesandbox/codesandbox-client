// @flow
import configs from './';

import prettierUI from './prettierRC/ui';
import sandboxUI from './sandbox/ui';

export default function getUI(configType: string) {
  switch (configType) {
    case configs.prettierRC.type: {
      return prettierUI;
    }
    case configs.sandboxConfig.type: {
      return sandboxUI;
    }
    default: {
      return null;
    }
  }
}
