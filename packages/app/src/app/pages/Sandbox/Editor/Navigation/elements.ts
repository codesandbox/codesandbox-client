import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({
    topOffset,
    bottomOffset,
    theme,
  }: {
    topOffset: number;
    bottomOffset: number;
    theme: any;
  }) => css`
    position: fixed;
    top: ${topOffset}px;
    bottom: ${bottomOffset}px;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 3.5rem;
    flex: 0 0 3.5rem;
    height: 100%;
    color: ${theme[`activityBar.inactiveForeground`] ||
      css`rgba(255, 255, 255, 0.5)`};
    font-size: 1.4rem;
    align-items: center;
    background-color: ${theme[`activityBar.background`] || css`inherit`};
  `}
`;

export const IconContainer = styled.div`
  ${({ selected, theme }: { selected: boolean; theme: any }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease all;
    height: 3.5rem;
    width: 3.5rem;
    font-size: 1.875rem;
    color: ${theme[`activityBar.inactiveForeground`] ||
      css`rgba(255, 255, 255, 0.5)`};
    cursor: pointer;

    &:hover {
      color: ${theme[`activityBar.foreground`] || css`white`};
    }

    ${selected &&
      css`
        color: ${theme[`activityBar.foreground`] || css`white`};
      `};
  `}
`;
