import styled from 'styled-components';
import Fullscreen from 'common/components/flex/Fullscreen';

export const Container = styled(Fullscreen)`
  color: white;

  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(-180deg, #282d2f 0%, #1d1f20 100%);
`;

export const Content = styled(Fullscreen)`
  border-top: 1px solid ${props => props.theme.background3};
  flex: 0 0 70px;
`;
