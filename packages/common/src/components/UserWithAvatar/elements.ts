import styled, { css } from 'styled-components';

import ContributorsBadgeBase from '../ContributorsBadge';

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

export const ContributorsBadge = styled(ContributorsBadgeBase)`
  margin: 0 0.5rem;
  font-size: 1.25em;
`;
