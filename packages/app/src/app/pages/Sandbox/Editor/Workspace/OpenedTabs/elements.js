import styled from 'styled-components';

export const Title = styled.div`
  padding-right: 0.5rem;
  padding-left: 6px;
  white-space: nowrap;
`;

export const Dir = styled.div`
  color: rgba(255, 255, 255, 0.3);
  padding-right: 1rem;
  white-space: nowrap;
`;

export const CrossIconContainer = styled.div`
  transition: 0.3s ease color;
  position: absolute;
  right: 1rem;

  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  }
`;
