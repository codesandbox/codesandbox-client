import { editorUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import { Text } from '@codesandbox/components';

import { OpenVSCodeSettingsButton } from './OpenVSCodeSettingsButton';

type Props = {
  hideTitle?: boolean;
};
export const VSCodePlaceholder: FunctionComponent<Props> = ({
  hideTitle = false,
}) =>
  hideTitle ? null : (
    <>
      <Text size={3} block fontStyle="italic" style={{ lineHeight: 1.5 }}>
        Some options are disabled because they are handled by VSCode. You can
        open the settings of VSCode by pressing {"'"}
        CTRL/CMD + ,{"'"}.
      </Text>
      <Route
        path={editorUrl()}
        render={({ match }) => match && <OpenVSCodeSettingsButton />}
      />
    </>
  );
