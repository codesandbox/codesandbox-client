import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  margin-top: 2rem;
  margin-bottom: 12rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;

  li {
    margin: 2rem;
  }

  ${props => props.theme.breakpoints.md} {
    li:not(:last-child) {
      margin-right: 0;
      margin-bottom: 2rem;
    }
    li {
      flex-shrink: 0;
      width: 100%;
      text-align: center;
    }
  }
`;
