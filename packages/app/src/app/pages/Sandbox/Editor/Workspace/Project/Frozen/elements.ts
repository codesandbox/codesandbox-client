import styled from 'styled-components';

export const FreezeContainer = styled.span`
  display: flex;
  justify-content: flex-end;
`;

export const FrozenWarning = styled.span`
  font-size: 12px;
  padding-top: 5px;
  margin: 1rem;
  margin-top: -20px;
  display: block;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
`;
