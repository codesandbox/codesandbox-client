import styled from 'styled-components';

export const HeroWrapper = styled.section`
  margin-top: 6rem;
  text-align: center;
`;

export const SignUp = styled.p`
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  margin-top: 0.5rem;
  color: ${props => props.theme.homepage.white};
  margin-bottom: 2.5rem;
`;

export const ImageWrapper = styled.div`
  img {
    display: block;
    box-shadow: 0 -8px 120px #1d1d1d;
  }
`;

export const Border = styled.div`
  position: absolute;
  background: #242424;
  left: 0;
  width: 100%;
  height: 1px;
`;
