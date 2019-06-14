import React from 'react';
import DetailInfo from './DetailInfo';

import { Container, IntegrationBlock, Name } from './elements';

function Integration({
  Icon,
  name,
  signOut,
  signIn,
  description,
  color,
  userInfo,
  loading,
  small = false,
}) {
  return (
    <Container small={small} loading={loading}>
      <IntegrationBlock small={small} bgColor={color}>
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
}

export default Integration;
