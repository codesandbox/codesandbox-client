import styled, { createGlobalStyle, css } from 'styled-components';

export const SlideStyles = createGlobalStyle`
  .slick-slide {
    padding-left: 12px;
    padding-right: 12px;

    &:first-child {
         padding-left: 0;
    }
  }

  .slick-track {
    margin-left: -0.5rem;
    margin-right: -0.5rem;

    position: relative;
  }

  .slick-slider {
    position: relative;
        margin-bottom: 2rem;
  }
`;

export const Grid = styled.main`
  display: grid;
  grid-gap: 60px;
  grid-template-columns: 400px 1fr;
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
  justify-content: center;

  a {
    font-family: 'Poppins';
    font-size: 1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
  }

  &:hover {
    background-color: #212629;
    transform: translateY(-5px);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.3);
  }
`;

export const ArrowContainer = styled.div`
  background: #1c2022;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -15px;
  z-index: 12;
  padding: 10px 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);

  ${props =>
    props.next &&
    css`
      left: auto;
      right: 0px;
    `};
`;

export const ArrowButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  appearance: none;

  svg {
    fill: #f2f2f2;
    width: 28px;
    height: auto;
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
