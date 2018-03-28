import styled, { component } from 'app/styled-components';
import Row from 'common/components/flex/Row';

export const ClickableContainer = styled(Row)`
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  border-radius: 2px;
`;

export const ProfileInfo = styled.div`
  font-weight: 400;
  text-align: right;
  margin-right: 1em;

  @media (max-width: 1300px) {
    display: none;
  }
`;

export const Name = styled.div`
  padding-bottom: 0.2em;
  color: white;
  font-size: 1em;
`;

export const Username = styled(component<{
  main: boolean
}>())`
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  font-size: ${props => (props.main ? 1 : 0.875)}em;
`;
