import React from 'react';
import SignInButton from 'app/pages/common/SignInButton';
import Margin from 'common/components/spacing/Margin';
import { Description } from '../../elements';

const More = () => (
  <div>
    <Description>
      Sign in to be able to make deployments, collaborate live with others and
      make commits to GitHub!
    </Description>

    <Margin margin={1}>
      <SignInButton block />
    </Margin>
  </div>
);

export default More;
