import styled, { css } from 'styled-components';

export const Card = styled.div`
  width: 100%;
  height: 735px;

  background: ${props => (props.dark ? '#151515' : props.theme.homepage.blue)};
  border-radius: 0.25rem;
  padding: 2.5rem 1.5rem;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${props => props.theme.breakpoints.md} {
    height: auto;
  }
`;

export const CardTitle = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  color: ${props => props.theme.homepage.white};
`;

export const Price = styled.h6`
  font-weight: 900;
  font-size: 36px;
  text-align: center;
  margin-bottom: 8px;

  color: ${props => props.theme.homepage.white};
`;

export const PriceSubText = styled.p`
  font-size: 13px;
  margin-bottom: 0;
  text-align: center;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  font-style: normal;
  text-align: left;
  color: ${props => props.theme.homepage.white};
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 19px;
  line-height: 34px;

  ${props => props.theme.breakpoints.md} {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const Button = styled.a`
  height: 2.75rem;
  text-decoration: none;
  background: ${props => props.theme.homepage.grey};
  border-radius: 0.125rem;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.homepage.white};
  transition: all 200ms ease;

  ${props =>
    props.white &&
    `
    background: ${props.theme.homepage.white};
    color: ${props.theme.homepage.blue};
  `}

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1.05);
  }

  &:focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1);
  }
`;

export const FeaturesTableHeader = styled.button`
  background: transparent;
  cursor: pointer;
  border: none;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 14rem 14rem;
  font-weight: normal;
  font-size: 19px;
  line-height: 23px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  background: #151515;
  border-bottom: 1px #242424;
  outline: none;
  color: ${props => props.theme.homepage.white};
  height: 56px;

  ${props =>
    props.team &&
    css`
      grid-template-columns: 1fr 12rem 12rem 12rem;
    `}

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr 5.625rem 3.75rem;
    font-size: 1rem;
  }
`;

export const FeaturesTable = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 20px;
  background: #242424;

  ${props => props.theme.breakpoints.md} {
    margin-left: 0 !important;
  }

  ${props => props.theme.breakpoints.xl} {
    overflow: scroll;
  }

  ${props =>
    !props.open &&
    `
    overflow: hidden;
    height: 0;

  `}

  span.text {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  li {
    display: grid;
    grid-template-columns: 1fr 14rem 14rem;

    ${props =>
      props.team &&
      css`
        grid-template-columns: 1fr 12rem 12rem 12rem;
      `}
    align-items: center;
    margin: 0;
    position: relative;

    ${props => props.theme.breakpoints.xl} {
      width: 850px;
    }

    > * {
      padding: 13px 0;
    }

    :last-child {
      padding-bottom: 80px;

      :after {
        height: 1px;
        width: 100%;
        content: '';
        background: #151515;
        height: 1px;
        width: 100%;
        content: '';
        background: #151515;
        display: block;
        position: absolute;
        bottom: 80px;
      }
    }

    :not(:last-child) {
      border-bottom: 1px solid #151515;
    }

    > *:not(:last-child) {
      border-right: 1px solid #151515;
    }

    ${props =>
      !props.team &&
      css`
        ${props.theme.breakpoints.md} {
          grid-template-columns: 1fr 3.75rem 3.75rem;
        }
      `}

    span {
      width: 100%;
      display: block;
      text-align: center;

      &:not(:first-child) {
        text-align: center;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      ${props => props.theme.breakpoints.md} {
        font-size: 1rem;
      }
    }
  }
`;

export const FeatureTitle = styled.span`
  font-style: normal;
  font-size: 19px;

  color: ${props => props.theme.homepage.white};
  text-align: left !important;
  padding-bottom: 0.25rem;
`;

export const CardContainer = styled.div`
  ${({ teams, theme }) => css`
    max-width: 90%;
    margin: auto;
    width: 1324px;
    display: grid;
    grid-template-columns: repeat(${teams ? 3 : 2}, 416px);
    grid-gap: 33px;
    justify-content: center;
    margin-top: 30px;

    ${teams &&
    `

    @media screen and (max-width: 1400px) {
      grid-template-columns: 1fr 1fr;

      div:last-child {
        grid-column: span 2;
        height: auto;

        a[class*="Button"]{
          margin-top: 40px;
        }
      }
    }
  `}

    ${theme.breakpoints.md} {
      grid-template-columns: 1fr;
      max-width: 100%;

      div:last-child {
        grid-column: 1;
      }
    }
  `}
`;

export const FeaturesTitle = styled.h3`
  font-weight: bold;
  font-size: 2.25rem;

  color: ${props => props.theme.homepage.white};
  margin-bottom: 3.75rem;
  margin-top: 6rem;
`;

export const Plan = styled(FeaturesTableHeader)`
  margin-top: 0;
  padding: 0;
  display: grid;
  padding: 0 20px;
  border-bottom: 1px solid #151515;
  cursor: initial;
  padding: 0.5 0rem;
  background: transparent;
  width: calc(100% + 40px);
  margin-left: -20px;

  ${props =>
    props.team &&
    css`
      grid-template-columns: 1fr 12rem 12rem 12rem;
    `}
  ${props => props.theme.breakpoints.xl} {
    width: 890px;
  }
`;

export const TableSection = styled.div`
  margin-bottom: 128px;
  ${props => props.theme.breakpoints.md} {
    position: relative;
    width: 120%;
    margin-left: -10%;
  }
`;

export const PlanName = styled.span`
  text-align: center;
  ${props =>
    props.paid &&
    `
      font-weight: bold;
      font-size: 19px;
      line-height: 23px;
      color: #0971f1;
  `};
`;

export const TableWrapper = styled.section`
  border: 1px solid #242424;
  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 4px 4px;
  }
`;

export const ProductChooser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #343434;
  width: fit-content;
  margin: auto;
  margin-bottom: 56px;

  button {
    font-weight: 900;
    font-size: 19px;
    line-height: 23px;
    color: ${props => props.theme.homepage.muted};
    border: none;
    background-color: transparent;
    cursor: pointer;

    &:after {
      content: '';
      width: 100%;
      display: block;
      margin-top: 21px;
    }

    &:not(:last-child) {
      margin-right: 70px;
    }

    &[aria-pressed='true'] {
      color: ${props => props.theme.homepage.white};

      &:after {
        margin-top: 20px;
        top: 2px;
        position: relative;
        border-bottom: 1px solid #ffffff;
      }
    }
  }
`;

export const ModeChooser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 75px;
`;
