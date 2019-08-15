import styled from 'styled-components';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { Title } from 'app/components/Title';

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export const StyledTitle = styled(Title)`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 36px;
  display: flex;
  color: ${props => props.theme.lightText};
  margin-bottom: 16px;
`;

export const Main = styled(Row)`
  display: grid;
  grid-template-columns: 1fr 340px;
  grid-gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Container = styled.div`
  background: ${props => props.theme.background5};
  width: 100vw;
`;
