import React from 'react';
import styled from 'styled-components';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import delayEffect from 'app/utils/animation/delay-effect';
import Margin from 'app/components/spacing/Margin';

import GithubIcon from 'react-icons/lib/go/mark-github';

const ProfileImage = styled.img`
  border-radius: 2px;
  margin-right: 1.5rem;

  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);

  ${delayEffect(0.05)};
`;

const Name = styled.div`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.25rem;
  ${delayEffect(0.1)}
`;

const Username = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => (props.main ? 1.5 : 1.25)}rem;
  font-weight: 200;
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  ${delayEffect(0.15)}

  margin-bottom: 1rem;
`;

const IconWrapper = styled(GithubIcon)`
  margin-left: 0.75rem;
  font-size: 1.1rem;
  color: white;
`;

type Props = {
  username: string,
  name: string,
  avatarUrl: string,
};

export default ({ username, name, avatarUrl }: Props) => (
  <Row style={{ flex: 1 }}>
    <ProfileImage alt={username} height={175} width={175} src={avatarUrl} />
    <Margin bottom={3}>
      <Column justifyContent="space-between">
        {name && <Name>{name}</Name>}
        <Username main={!name}>
          {username}
          <a
            href={`https://github.com/${username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconWrapper />
          </a>
        </Username>
      </Column>
    </Margin>
  </Row>
);
