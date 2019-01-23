import styled from 'styled-components';

export const ErrorTitle = styled.div`
  font-size: 1.25rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;
