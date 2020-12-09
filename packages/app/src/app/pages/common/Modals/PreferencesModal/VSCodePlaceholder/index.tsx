import { editorUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';

import { OpenVSCodeSettingsButton } from './OpenVSCodeSettingsButton';

export const VSCodePlaceholder: FunctionComponent = () => (
  <>
    <Text block fontStyle="italic" size={3} style={{ lineHeight: 1.5 }}>
      Some options are disabled because they are handled by VSCode. You can open
      the settings of VSCode by pressing <kbd>CTRL/CMD</kbd> + <kbd>,</kbd>.
    </Text>

    <Route
      path={editorUrl()}
      render={({ match }) => (match ? <OpenVSCodeSettingsButton /> : null)}
    />
  </>
);
