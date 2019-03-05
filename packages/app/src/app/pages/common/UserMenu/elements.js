import styled from 'styled-components';
import Row from 'common/lib/components/flex/Row';

export const ClickableContainer = styled(Row)`
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  border-radius: 2px;

  padding: 2px;
  border: 2px solid ${props => props.theme.secondary};
`;
