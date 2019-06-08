import styled, { css } from 'styled-components';

export const Container = styled.button`
  ${({ color = `#fdc362` }) => css`
    width: 92px;
    height: 32px;
    padding: 2px;
    margin-left: 8px;
    background-image: repeating-linear-gradient(
      -45deg,
      ${color} 0 3.5px,
      #1c2022 3.5px 7px
    );
    border: none;
    border-width: 2px;
    border-radius: 4px;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  `}
`;

export const Content = styled.div`
  ${({ hover = `#f6b154` }: { hover: string }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 6px 8px;
    background-color: #1c2022;
    border-radius: 4px;
    color: #b8b9ba;
    font-family: Poppins, Roboto, sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease 0s;

    &:hover {
      color: #fff;
      background-color: ${hover};
    }

    svg {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  `}
`;
