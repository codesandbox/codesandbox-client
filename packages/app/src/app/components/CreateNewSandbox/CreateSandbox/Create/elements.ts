import styled from 'styled-components';
import { SubHeader } from '../elements';

export const CenteredMessage = styled(SubHeader).attrs({ as: 'div' })`
  text-align: center;
  padding: 1rem;
`;

export const SearchWrapper = styled.div`
  @media screen and (max-width: 800px) {
    padding-top: 8px;
  }
`;
