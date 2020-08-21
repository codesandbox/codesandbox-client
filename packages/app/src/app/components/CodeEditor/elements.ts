import styled from 'styled-components';

export const Icons = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  padding: 0.5rem 1rem;
  z-index: 40;

  font-size: 0.875rem;
`;

export const Icon = styled.div`
  transition: 0.3s ease color;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;
