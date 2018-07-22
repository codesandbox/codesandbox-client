import React from 'react';
import SignInButton from 'app/pages/common/SignInButton';
import Margin from 'common/components/spacing/Margin';
import track from 'common/utils/analytics';

import { Description } from '../../elements';

export default class More extends React.PureComponent {
  componentDidMount() {
    track('Workspace - More Opened');
  }

  render() {
    return (
      <div>
        <Description>
          Sign in to be able to organize your sandboxes with a dashboard, make
          deployments, collaborate live with others, make commits to GitHub and
          more!
        </Description>

        <Margin margin={1}>
          <SignInButton block />
        </Margin>
      </div>
    );
  }
}
