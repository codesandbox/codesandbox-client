import styled from 'styled-components';
import Title from 'app/components/Title';
import Row from 'common/components/flex/Row';

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export const StyledTitle = styled(Title)`
  display: inline-block;
  text-align: left;
  font-size: 2rem;

  /* Algolia Icon */
  + div {
    @media (max-width: 768px) {
      float: none;
      margin-top: -10px;
      padding: 0;
      margin-bottom: 1.5rem;
    }
  }
`;

export const Main = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
