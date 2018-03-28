import styled from 'app/styled-components';
import Centered from 'common/components/flex/Centered';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

export const Content = styled(Centered)`
  max-width: 50em;
  margin: auto;
  margin-top: 10%;
`;

export const Code = styled.pre`
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;
