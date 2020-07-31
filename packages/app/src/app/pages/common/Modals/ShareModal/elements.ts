import { Preference } from '@codesandbox/common/lib/components/Preference';
import styled from 'styled-components';

export const FilesContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

export const PaddedPreference = styled(Preference)`
  color: #e5e5e5;
  padding-bottom: 1rem;

  &:last-child {
    padding-bottom: 0;
  }
`;
