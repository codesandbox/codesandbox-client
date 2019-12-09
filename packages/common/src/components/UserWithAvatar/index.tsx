import React, { ComponentProps, FunctionComponent } from 'react';

import ContributorHelm from '../ContributorsBadge';
import { PatronStar } from '../PatronStar';

import { CenteredText, AuthorName, Image, Names, Username } from './elements';

type Props = ComponentProps<typeof CenteredText> & {
  avatarUrl: string;
  username: string;
  name?: string;
  hideBadge?: boolean;
  useBigName?: boolean;
} & Partial<Pick<ComponentProps<typeof PatronStar>, 'subscriptionSince'>>;

export const UserWithAvatar: FunctionComponent<Props> = ({
  avatarUrl,
  username,
  name,
  hideBadge,
  subscriptionSince,
  useBigName,
  ...props
}) => (
  <CenteredText {...props}>
    {avatarUrl && <Image src={avatarUrl} alt={username} />}

    <AuthorName useBigName={useBigName}>
      <Names>
        {name && <div>{name}</div>}

        {username && (
          <Username hasTwoNames={Boolean(name && username)}>
            {username}
          </Username>
        )}
      </Names>

      {subscriptionSince && (
        <PatronStar
          style={{ fontSize: '1.125em', marginBottom: '0.1em' }}
          subscriptionSince={subscriptionSince}
        />
      )}

      {!hideBadge && (
        <ContributorHelm
          style={{ margin: '0 .5rem', fontSize: '1.25em' }}
          username={username}
        />
      )}
    </AuthorName>
  </CenteredText>
);
