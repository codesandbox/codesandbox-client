import { Preference } from '@codesandbox/common/lib/components/Preference';
import styled from 'styled-components';

export const PaddedPreference = styled(Preference)`
  color: #e5e5e5;
  padding-bottom: 1rem;

  &:last-child {
    padding-bottom: 0;
  }
`;
