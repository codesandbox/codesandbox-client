import styled from 'styled-components';

import { EntryContainer as EntryContainerBase } from '../../../elements';

export const EntryContainer = styled(EntryContainerBase)`
  position: relative;
`;

export const MainBadge = styled.div`
  font-weight: 600;
  position: absolute;
  right: 2rem;
`;

export const Port = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;

  > div {
    margin-left: 0.75rem;
  }
`;
