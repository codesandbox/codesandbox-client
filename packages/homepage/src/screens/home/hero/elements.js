import styled from 'styled-components';

export const HeroWrapper = styled.section`
  margin-top: 6rem;
  text-align: center;
  overflow: hidden;
  padding: 0 2rem;
`;

export const SignUp = styled.p`
  font-size: 0.6875rem;
  line-height: 0.8125rem;
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
  background: ${props => props.theme.homepage.grey};
  left: 0;
  width: 100%;
  height: 1px;
`;
