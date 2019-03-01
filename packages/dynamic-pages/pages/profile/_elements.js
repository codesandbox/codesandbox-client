import styled, { css } from 'styled-components';

export const Grid = styled.main`
  display: grid;
  grid-gap: 60px;
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
  color: #f2f2f2;
`;

export const More = styled.div`
  transition: all 200ms ease;
  background-color: #1c2022;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
  display: flex !important;
  align-items: center;
  position: absolute;
  height: 100%;

  a {
    font-family: 'Poppins';
    font-size: 1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
    width: 300px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: #212629;
    transform: translateY(-5px);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.3);
  }
`;

const activeCSS = css`
  color: white;

  &:after {
    width: 110%;

    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }
`;

export const NavigationLink = styled.a`
  transition: 0.3s ease all;

  display: block;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  cursor: pointer;

  &:after {
    content: '';
    margin-top: 8px;
    display: block;
    background: #40a9f3;
    height: 2px;
    box-sizing: border-box;
    width: 0%;
    margin-left: -5%;
    transition: all 200ms ease;

    @media screen and (max-width: 500px) {
      margin-left: 0%;
    }
  }

  &:hover {
    ${activeCSS};
  }

  ${props =>
    props.active &&
    css`
      ${activeCSS};
    `};
`;

export const TabNavigation = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 3rem;

  @media screen and (max-width: 500px) {
    display: block;
    text-align: center;
  }
`;
