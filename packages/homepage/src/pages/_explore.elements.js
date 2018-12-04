import styled from 'styled-components';
import Slider from 'react-slick';
import SliderCSS from 'slick-carousel/slick/slick.css';

const colors = ['#78D3F6', '#5DAC7D', '#7B5EA5', '#78C149'];

export const SliderStyled = styled(Slider)`
  ${SliderCSS};

  .slick-dots {
    /* Damn you ken */
    display: flex !important;
    list-style: none;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    li {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-right: 10px;
      }

      &.slick-active button {
        width: 13px;
        height: 13px;
      }
    }

    ${colors.map(
      (color, i) => `
    li:nth-child(${i + 1}) {
      button {
        background: ${color}
      }
    }
   `
    )};

    button {
      appearance: none;
      border: none;
      text-indent: -9999px;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      padding: 0;
      transition: all 200ms ease;
    }
  }
`;
export const Container = styled.div`
  color: ${props => props.theme.new.title}

  margin-bottom: 4rem;
`;

export const Sandboxes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
