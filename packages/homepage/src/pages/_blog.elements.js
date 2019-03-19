import styled, { css } from 'styled-components';

export const Posts = styled.article`
  display: flex;
  align-items: flex-start;
  background: ${props => props.theme.background2};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 30px;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const Subtitle = styled.h3`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;

  color: #b8b9ba;
`;

export const Thumbnail = styled.img`
  margin-right: 25px;

  @media screen and (max-width: 1200px) {
    margin-bottom: 25px;
    width: 100%;
  }
`;

export const Aside = styled.aside`
  section {
    display: flex;
    align-items: center;
  }

  ${({ mobile }) =>
    !mobile &&
    css`
      @media screen and (max-width: 850px) {
        display: none;
      }
    `};
  ${({ mobile }) =>
    mobile &&
    css`
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-direction: row-reverse;
      margin-top: 25px;
      width: 100%;
      @media screen and (min-width: 851px) {
        display: none;
      }
    `};
`;

export const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-gap: 90px;

  @media screen and (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
