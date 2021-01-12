import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 140px 0rem 1rem 0rem;
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    font-weight: 900;
    font-size: 2.5rem;
    line-height: 3rem;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;
    text-align: center;
    max-width: 100%;
    margin: auto;

    ${props =>
      props.left &&
      `
    text-align: left;
  
  `}

    ${props => props.theme.breakpoints.md} {
      font-size: 1.5rem;
      line-height: 1.2;
      max-width: 80%;
    }
  `};
`;

export const ContentBlock = styled.div`
  ${({ theme, cols, small, center }) => css`
    display: grid;
    grid-template-columns: repeat(${cols || '3'}, 1fr);
    grid-gap: 3rem 5rem;
    font-size: ${small ? '19px' : '23px'};
    line-height: 1.5rem;
    color: ${theme.homepage.muted};

    ${props => props.theme.breakpoints.md} {
      grid-template-columns: repeat(1, 1fr);
    }

    ${center && `text-align: center;`}

    h3 {
      font-style: normal;
      font-weight: 900;
      font-size: ${small ? '19px' : '23px'};
      line-height: 32px;
      color: ${theme.homepage.white};
      margin-bottom: 16px;
    }
  `};
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ContentBlockImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #${props => props.bg};
  margin-bottom: 32px;
  border: 1px solid #343434;
  box-sizing: border-box;
  border-radius: 8px;
`;

export const FeaturedImage = styled.div`
  width: 100%;
  height: 440px;
  background: url(${props => props.bg});
  margin-bottom: 56px;
  margin-top: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border: 1px solid #242424;
  background-size: cover;
  border-radius: 4px;
`;
