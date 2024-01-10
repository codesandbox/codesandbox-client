import React, { FunctionComponent, useRef } from 'react';

import { SubTitle } from 'app/components/SubTitle';

import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { TokenInput } from './elements';

export const Prompt: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  const tokenInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <LogoFull style={{ paddingBottom: 32 }} />
      {/* <Title>Hello <br/>{user.username}!</Title> */}

      <SubTitle style={{ paddingBottom: 16 }}>
        The CLI needs authorization to work.
        <br />
        Please paste the following code in the CLI:
      </SubTitle>

      <TokenInput
        onClick={() => tokenInputRef.current.select()}
        ref={tokenInputRef}
        value={authToken}
        style={{ width: '100%' }}
      />
    </>
  );
};
