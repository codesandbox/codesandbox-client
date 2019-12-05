import styled, { css } from 'styled-components';
import { H3 } from '../../../components/Typography';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 642px;
  grid-gap: 30px;

  ${props => props.theme.breakpoints.md} {
    margin-bottom: 200px;
  }

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr;
  }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const tweetStyle = css`
  right: -6rem;
  margin-top: 2rem;
  min-height: 20rem;
  background: #242424;

  @media screen and (max-width: 1260px) {
    right: auto;
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }
`;

export const Img = styled.img`
  ${props => props.theme.breakpoints.lg} {
    display: none;
  }
`;

export const Title = styled(H3)`
  margin-bottom: 1.5rem;
`;
