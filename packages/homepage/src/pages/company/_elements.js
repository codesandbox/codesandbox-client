import styled, { css } from 'styled-components';

export const Title = styled.h1`
  font-weight: 900;
  font-size: 48px;
  line-height: 57px;
  text-align: center;
  margin: auto;
  margin-bottom: 40px;
`;

export const Text = styled.p`
  color: ${props => props.theme.homepage.muted};
  font-size: 28px;
  line-height: 33px;
  text-align: center;
  width: 862px;
  text-align: center;
  margin: auto;
  margin-bottom: 70px;
  max-width: 100%;
  position: relative;
  z-index: 1;

  @media screen and (max-width: 768px) {
    font-size: 18px;
    line-height: 1.5;
  }
`;

export const Investors = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.5rem;
  justify-content: center;
  margin-top: 4rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.45rem 3.125rem;

    img {
      max-width: 100%;
      width: 297px;
    }
  }
`;

const angelCSS = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;
  justify-content: center;
  margin-top: 1.5rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
  }

  ${props => props.theme.breakpoints.sm} {
    grid-template-columns: repeat(1, minmax(255px, 1fr));
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: center;
    padding: 2.45rem 0;
    color: #b8b9ba;

    img {
      margin-bottom: 1.625rem;
    }

    b {
      padding-bottom: 0.5rem;
      font-size: 1.5rem;
      color: ${props => props.theme.homepage.white};
    }
  }
`;

export const AngelInvestors = styled.div`
  ${angelCSS}

  section {
    ${angelCSS}
    grid-template-columns: repeat(3, 1fr);
    grid-column: 1/-1;
  }
`;
