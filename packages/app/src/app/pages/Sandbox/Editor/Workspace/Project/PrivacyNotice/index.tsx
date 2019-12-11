import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { Explanation } from './elements';

export const PrivacyNotice: FunctionComponent = () => (
  <Explanation>
    You can change privacy of a sandbox as a{' '}
    <a href={patronUrl()} rel="noopener noreferrer" target="_blank">
      patron
    </a>
    .
  </Explanation>
);
