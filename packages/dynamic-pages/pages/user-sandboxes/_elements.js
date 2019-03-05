import styled, { css } from 'styled-components';

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
