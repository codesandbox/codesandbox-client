import styled from 'app/styled-components';
import { NavLink } from 'react-router-dom';

export const Content = styled.div`
    margin-top: 5%;
    text-align: left;
    color: rgba(255, 255, 255, 0.7);

    h1 {
        color: rgba(255, 255, 255, 0.9);
    }

    h2 {
        color: rgba(255, 255, 255, 0.9);
    }
`;

export const NavigationLink = styled(NavLink)`
  transition: 0.3s ease all;

  display: block;
  color: white;
  padding: 0rem 4rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 300;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
`;

export const LegalNavigation = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 1.25rem;
    color: white;
    width: 100%;
    margin-bottom: 3rem;
`;
