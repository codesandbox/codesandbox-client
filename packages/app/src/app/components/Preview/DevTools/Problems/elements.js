import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background2};
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.8);
`;

export const File = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);

  cursor: pointer;
`;

export const Path = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

export const FileName = styled.span`
  color: rgba(255, 255, 255, 0.8);

  flex: 1;
`;

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  font-size: 1.125rem;

  color: white;

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease color;

    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`;
