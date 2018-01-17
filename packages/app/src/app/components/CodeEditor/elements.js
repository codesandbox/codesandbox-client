import styled from 'styled-components';

export const Icons = styled.div`
  position: absolute;
  top: 0;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  z-index: 40;
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
