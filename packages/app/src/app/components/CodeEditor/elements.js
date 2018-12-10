import styled from 'styled-components';

export const Icons = styled.div`
  position: absolute;
  top: 0;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  padding: 0.5rem 1rem;
  z-index: 40;

  ${props =>
    props.small &&
    `fontSize: .875rem
`};
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

export const Container = styled.div`
  height: ${props => props.height || '100%'};
  width: ${props => props.width || '100%'};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
