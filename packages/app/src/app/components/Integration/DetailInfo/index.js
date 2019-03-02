import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import Margin from 'common/libcomponents/spacing/Margin';
import Tooltip from 'common/libcomponents/Tooltip';
import Button from '../../Button';

import { Details, Heading, Info, Action } from './elements';

function DetailInfo({ heading, info, signOut, signIn }) {
  return (
    <Details>
      <Margin right={2}>
        <Heading>{heading}</Heading>
        <Info>{info}</Info>
      </Margin>

      {signOut ? (
        <Tooltip title="Sign out">
          <Action onClick={signOut} red>
            <CrossIcon />
          </Action>
        </Tooltip>
      ) : (
        <Button small onClick={signIn}>
          Sign in
        </Button>
      )}
    </Details>
  );
}

export default DetailInfo;
