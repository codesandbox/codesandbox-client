import React, { ComponentProps, FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import ContributorsBadge from './Badge';

export const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const AuthorName = styled.span<{ useBigName?: boolean }>`
  display: inline-flex;
  align-items: center;
  margin: 0 0.75em;

  ${props =>
    props.useBigName &&
    css`
      margin: 0 0.75em;
      font-size: 1rem;
    `};
`;

export const Names = styled.div`
  display: inline-flex;

  flex-direction: column;
`;

export const Username = styled.div<{ hasTwoNames?: boolean }>`
  ${props =>
    props.hasTwoNames &&
    css`
      opacity: 0.7;
      font-size: 0.75em;
    `};
`;

export const Image = styled.img`
  width: 1.75em;
  height: 1.75em;
  border-radius: 2px;
  border: 2px solid rgba(255, 255, 255, 0.5);
`;

type Props = ComponentProps<typeof CenteredText> & {
  avatarUrl: string;
  username: string;
  name?: string;
  hideBadge?: boolean;
  useBigName?: boolean;
};

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

      {!hideBadge && <ContributorsBadge username={username} />}
    </AuthorName>
  </CenteredText>
);
