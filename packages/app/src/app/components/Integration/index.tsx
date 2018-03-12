import * as React from 'react';
import DetailInfo from './DetailInfo';

import { Container, IntegrationBlock, Name } from './elements';

type Props = {
  Icon: React.ComponentClass
  name: string
  signOut: () => void
  signIn: () => void
  description: string
  color: string
  userInfo: {
    email: string
  }
  loading: boolean
  small: boolean
}

const Integration: React.SFC<Props> = ({
  Icon,
  name,
  signOut,
  signIn,
  description,
  color,
  userInfo,
  loading,
  small = false,
}) => {
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
