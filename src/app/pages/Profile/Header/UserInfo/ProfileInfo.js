import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import GithubIcon from 'react-icons/lib/go/mark-github';
import StarIcon from 'react-icons/lib/go/star';
import { Link } from 'react-router-dom';
import { patronUrl } from 'app/utils/url-generator';

import Row from 'app/components/flex/Row';
import Tooltip from 'app/components/Tooltip';
import Column from 'app/components/flex/Column';
import delayEffect from 'app/utils/animation/delay-effect';
import Margin from 'app/components/spacing/Margin';
import Badge from 'app/utils/badges/Badge';
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

  ${props => props.subscribed && `color: ${props.theme.primary()};`};
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
  badges: Array<{
    id: string,
    name: string,
  }>,
  subscriptionSince: ?string,
};

const Badges = ({ badges }: { badges: Array<{ id: string, name: string }> }) =>
  <Margin left={0.5}>
    <Link to={patronUrl()}>
      {badges.map(badge => <Badge key={badge.id} badge={badge} size={50} />)}
    </Link>
  </Margin>;

export default ({
  username,
  badges,
  subscriptionSince,
  name,
  avatarUrl,
}: Props) =>
  <Row style={{ flex: 1 }}>
    <ProfileImage alt={username} height={175} width={175} src={avatarUrl} />
    <Margin bottom={3}>
      <Column justifyContent="space-between">
        {name &&
          <Name subscribed={Boolean(subscriptionSince)}>
            {name}
            {subscriptionSince &&
              <PatronStar subscriptionSince={subscriptionSince} />}
            <Badges badges={badges} />
          </Name>}
        <Username main={!name}>
          {username}
          <a
            href={`https://github.com/${username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconWrapper />
          </a>
          {!name && <Badges badges={badges} />}
        </Username>
      </Column>
    </Margin>
  </Row>;
