import React from 'react';
import {
  Container,
  ProfilePicture,
  TeamBadge,
  PatronBadge,
  ProBadge,
} from './elements';

const getBadge = ({ isPro, isTeam, isPatron, isContributor }) => {
  switch (true) {
    case isTeam:
      return <TeamBadge>Team</TeamBadge>;
    case isPatron:
      return <PatronBadge>Patron</PatronBadge>;
    case isPro:
      return <ProBadge>Pro</ProBadge>;
    // case isContributor:
    //   return <ContributorBadge>Contributor</ContributorBadge>;
    default:
      return null;
  }
};

export interface IAvatarProps {
  img: string;
  name: string;
  isTeam?: boolean;
  isPatron?: boolean;
  isPro?: boolean;
  isContributor?: boolean;
}

export const Avatar: React.FC<IAvatarProps> = ({
  img,
  name,
  isTeam = false,
  isPatron = false,
  isPro = false,
  isContributor = false,
  ...props
}) => (
  <Container {...props}>
    <ProfilePicture src={img} alt={name} />
    {getBadge({ isPro, isTeam, isPatron, isContributor })}
  </Container>
);
