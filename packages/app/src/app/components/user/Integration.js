import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import Margin from 'common/components/spacing/Margin';
import Tooltip from 'common/components/Tooltip';
import Button from '../buttons/Button';

import {
  Container,
  IntegrationBlock,
  Details,
  Name,
  Heading,
  Info,
  Action,
} from './elements';

const DetailInfo = ({ heading, info, signOut, signIn }) => (
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

export default ({
  Icon,
  name,
  signOut,
  signIn,
  description,
  color,
  userInfo,
  loading,
}) => (
  <Container loading={loading}>
    <IntegrationBlock bgColor={color}>
      <Icon />
      <Name>{name}</Name>
    </IntegrationBlock>
    {userInfo ? (
      <DetailInfo
        signOut={signOut}
        heading="Signed in as"
        info={userInfo.email || 'Loading...'}
      />
    ) : (
      <DetailInfo signIn={signIn} heading="Enables" info={description} />
    )}
  </Container>
);
