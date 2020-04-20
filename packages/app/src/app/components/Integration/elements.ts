import styled, { css } from 'styled-components';

export const Container = styled.div<{
  small: boolean;
  loading: boolean;
}>`
  ${({ small, loading, theme }) => css`
    display: inline-flex;
    width: 100%;
    border-radius: 4px;
    border: 1px solid ${theme.colors.avatar.border};
    color: ${theme.light ? css`#636363` : css`rgba(255, 255, 255, 0.8)`};
    overflow: hidden;

    ${small &&
      css`
        flex-direction: column;
        font-size: 0.875rem;
      `};

    ${loading &&
      css`
        opacity: 0.5;
      `};
  `}
`;

export const IntegrationBlock = styled.div<{ bgColor: string; small: boolean }>`
  ${({ bgColor, small }) => css`
    display: inline-flex;
    flex: 1;
    align-items: center;
    padding: 1em 1.5em;
    background-color: ${bgColor};
    color: white;
    font-size: 1.25em;

    ${small &&
      css`
        padding: 0.75em 0.75em;
        font-size: 1em;
      `};
  `}
`;

export const Name = styled.span`
  margin-left: 0.75em;
  font-size: 1.375em;
`;
