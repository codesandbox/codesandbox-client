import { editorUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';

import { Container } from './elements';
import { OpenVSCodeSettingsButton } from './OpenVSCodeSettingsButton';

type Props = {
  hideTitle?: boolean;
};
export const VSCodePlaceholder: FunctionComponent<Props> = ({
  hideTitle = false,
}) =>
  hideTitle ? null : (
    <Container>
      Some options are disabled because they are handled by VSCode. You can open
      the settings of VSCode by pressing {"'"}
      CTRL/CMD + ,{"'"}.
      <Route
        path={editorUrl()}
        render={({ match }) => match && <OpenVSCodeSettingsButton />}
      />
    </Container>
  );
