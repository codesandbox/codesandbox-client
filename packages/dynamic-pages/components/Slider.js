import React from 'react';
import Slider from 'react-slick';
import styled, { createGlobalStyle, css } from 'styled-components';
import Right from 'react-icons/lib/fa/angle-right';
import Left from 'react-icons/lib/fa/angle-left';

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

const settings = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  nextArrow: <Arrow next />,
  prevArrow: <Arrow prev />,
};

function Arrow({ onClick, next }) {
  return (
    <ArrowContainer next={next}>
      <ArrowButton onClick={onClick}>{next ? <Right /> : <Left />}</ArrowButton>
    </ArrowContainer>
  );
}

export default ({ children }) => (
  <>
    <SlideStyles />
    <Slider {...settings}>{children}</Slider>
  </>
);
