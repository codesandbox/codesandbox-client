import styled from 'styled-components';

export const Grid = styled.main`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 400px 1fr;

  @media screen and (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Title = styled.h3`
  font-family: Poppins, arial;
  font-weight: 300;
  font-size: 24px;
  margin-bottom: 30px;
  color: ${props => props.theme.new.title};
`;

export const More = styled.div`
  border-radius: 4px;
  transition: all 200ms ease;
  background-color: #1c2022;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: stretch;
  justify-content: center;
  height: 100%;

  a {
    font-family: 'Poppins';
    font-size: 1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  }

  &:hover {
    background-color: #212629;
    transform: translateY(-5px);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.3);
  }
`;
