import React from 'react';
import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/go/mark-github';

import Row from 'common/components/flex/Row';
import Column from 'common/components/flex/Column';
import delayEffect from 'common/utils/animation/delay-effect';
import Margin from 'common/components/spacing/Margin';
import PatronStar from 'app/components/user/PatronStar';

const ProfileImage = styled.img`
  border-radius: 2px;
  margin-right: 1.5rem;

  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  background-color: ${props => props.theme.background2};

  ${delayEffect(0.05)};
`;

const Name = styled.div`
  ${delayEffect(0.1)};
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.25rem;
`;

const Username = styled.div`
  ${delayEffect(0.15)};
  display: flex;
  align-items: center;
  font-size: ${props => (props.main ? 1.5 : 1.25)}rem;
  font-weight: 200;
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
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
  subscriptionSince: ?string,
};

export default ({ username, subscriptionSince, name, avatarUrl }: Props) => (
  <Row style={{ flex: 1 }}>
    <ProfileImage alt={username} height={175} width={175} src={avatarUrl} />
    <Margin bottom={3}>
      <Column justifyContent="space-between">
        {name && (
          <Name>
            {name}
            {subscriptionSince && (
              <PatronStar subscriptionSince={subscriptionSince} />
            )}
          </Name>
        )}
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
