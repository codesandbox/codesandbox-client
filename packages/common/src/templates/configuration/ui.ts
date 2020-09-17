import React from 'react';
import configs from '.';

import prettierUI from './prettierRC/ui';
import sandboxUI from './sandbox/ui';
import falkerConfigUI from './faker-config/ui';
import { ConfigurationUIProps } from './types';

export default function getUI(
  configType: string
): {
  ConfigWizard:
    | React.SFC<ConfigurationUIProps>
    | React.ComponentClass<ConfigurationUIProps>;
} {
  switch (configType) {
    case configs.prettierRC.type: {
      return prettierUI;
    }
    case configs.sandboxConfig.type: {
      return sandboxUI;
    }
    case configs.fakerConfig.type: {
      return falkerConfigUI;
    }
    default: {
      return null;
    }
  }
}
