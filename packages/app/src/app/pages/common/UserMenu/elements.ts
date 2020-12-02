import styled from 'styled-components';

export const ProfileImage = styled.img`
  border-radius: 2px;
  padding: 2px;
  border: 2px solid ${props => props.theme.secondary};
`;

/* Legacy stuff - should be replaced with the new Icon from the design system */
export const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  width: 24px;
  height: 24px;
  font-size: 24px;
  margin-right: 8px;
`;
