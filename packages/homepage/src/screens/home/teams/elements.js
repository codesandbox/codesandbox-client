import styled from 'styled-components';
import { P } from '../../../components/Typography';

export const List = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  margin-top: 2rem;
  margin-bottom: 12rem;
  flex-wrap: wrap;
  justify-content: center;

  li:not(:last-child) {
    margin-right: 5rem;
  }

  ${props => props.theme.breakpoints.md} {
    li:not(:last-child) {
      margin-right: 0;
      margin-bottom: 2rem;
    }
    li {
      flex-shrink: 0;
      width: 100%;
      text-align: center;
    }
  }
`;
export const Title = styled(P)`
  text-align: center;
  margin-top: 12rem;
`;
