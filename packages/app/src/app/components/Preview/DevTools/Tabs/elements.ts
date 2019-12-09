import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: auto;
  margin-right: 1rem;
  overflow-x: auto;
`;

export const Tabs = styled.div`
  flex: auto;
  display: flex;
`;

export const Actions = styled.div`
  font-size: 1.125rem;
  display: inline-flex;
  align-items: center;

  svg {
    margin: 0 0.5rem;

    transition: 0.3s ease all;

    cursor: pointer;
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};

    &:hover {
      color: white;
    }
  }
`;
