import styled from 'styled-components';

export const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  width: 100%;
  padding: 1rem;
  border-bottom: 2px solid;
  border-color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
`;
