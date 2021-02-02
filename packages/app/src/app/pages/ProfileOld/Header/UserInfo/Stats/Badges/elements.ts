import ContributorsBadgeBase from '@codesandbox/common/lib/components/ContributorsBadge';
import MarginBase from '@codesandbox/common/lib/components/spacing/Margin';
import styled from 'styled-components';

export const ContributorsBadge = styled(ContributorsBadgeBase)`
  display: inline-block;
  font-size: 3rem;
  margin-left: 1rem;
`;

export const Margin = styled(MarginBase)`
  align-items: center;
  display: flex;
`;
