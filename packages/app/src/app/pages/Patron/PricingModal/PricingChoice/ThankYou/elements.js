import styled from 'styled-components';
import delay from 'common/lib/utils/animation/delay-effect';

export const Title = styled.div`
  ${delay(0)} transition: 0.3s ease all;
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  color: ${props => props.color};
`;

export const SubTitle = styled.div`
  ${delay(0.1)} font-size: 1.25rem;
  font-weight: 300;
  margin: 1rem;
  margin-bottom: 0rem;
  text-align: center;
`;
