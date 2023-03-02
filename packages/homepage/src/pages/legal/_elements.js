import styled from 'styled-components';
import { Link } from 'gatsby';

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  max-width: 800px;
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 4rem;
  color: #999999;

  h1,
  h2 {
    color: #fff;
    margin: 3rem 0 0.5rem 0;
    font-size: 1.3rem;
    font-weight: 500;
  }

  h3 {
    color: #fff;
    margin: 3rem 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 500;
  }
`;

export const NavigationLink = styled(Link)`
  transition: 0.3s ease all;

  display: block;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;

  &:after {
    content: '';
    margin-top: 8px;
    display: block;
    background: ${props => props.theme.link};
    height: 2px;
    box-sizing: border-box;
    width: 0%;
    margin-left: -5%;
    transition: all 200ms ease;

    @media screen and (max-width: 500px) {
      margin-left: 0%;
    }
  }

  &.active,
  &:hover {
    color: ${props => props.theme.homepage.white};

    &:after {
      width: 110%;

      @media screen and (max-width: 500px) {
        width: 100%;
      }
    }
  }
`;

export const LegalNavigation = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 3rem;

  @media screen and (max-width: 500px) {
    display: block;
    text-align: center;
  }
`;
