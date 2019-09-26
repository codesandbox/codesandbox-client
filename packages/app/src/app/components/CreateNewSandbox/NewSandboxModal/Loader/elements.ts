import styled from 'styled-components';
import { fadeStyles } from '../ScrollableContent/elements';

export const LoadingWrapper = styled.div`
  overflow: hidden;
  height: calc(100% - 110px);

  &:after {
    ${fadeStyles}
    bottom: 0;
  }
`;

export const Individual = styled.div`
  margin: 1.5rem;
  margin-bottom: 0;
`;
