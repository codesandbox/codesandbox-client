import styled from "styled-components";

export const FooterWrapper = styled.footer`
  padding-bottom: 1rem;

  margin-bottom: 3rem;
  border-top: 1px solid #343434;
`;

export const Nav = styled.section`
  padding-top: 6rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 3rem;
  max-width: 80%;
  width: 1200px;
  margin: auto;
  margin-bottom: 8rem;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.homepage.white};
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li:first-child {
      margin-bottom: 1rem;
    }

    li span {
      font-size: 10px;
      padding: 2px;
      text-align: center;
      font-weight: 500;
      color: #151515;
      height: 1rem;
      width: 1rem;
      display: inline-block;
      background: #dcff50;
      border-radius: 50%;
      position: relative;
      top: -0.5rem;
      line-height: 12px;
    }
  }
`;

export const Social = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
  gap: 10px;

  svg {
    path {
      transition: all 200ms ease;
    }

    &:hover path {
      fill: ${(props) => props.theme.homepage.white};
    }
  }
`;

export const Title = styled.h6`
  font-style: normal;
  font-weight: 900;
  font-size: 19px;
  line-height: 23px;
  margin-bottom: 16px;
`;
