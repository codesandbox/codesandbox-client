import EnvIcon from 'react-icons/lib/go/key';
import styled from 'styled-components';

import { WorkspaceInputContainer } from '../../../../elements';

export const EnvironmentIcon = styled(EnvIcon)`
  margin-right: 0.6rem;
  font-size: 1rem;
  margin-left: 4px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const EnvModalContainer = styled(WorkspaceInputContainer)`
  flex-direction: column;
`;

export const LoadingContainer = styled.div`
  font-style: italic;
`;
