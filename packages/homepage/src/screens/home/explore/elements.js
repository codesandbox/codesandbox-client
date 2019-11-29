import styled from 'styled-components';

export const ImageWrapper = styled.div`
  margin-top: 2rem;
  width: calc(100vw - ((100vw - 1200px) / 2) - 20px);
  overflow: auto;

  ${props => props.theme.breakpoints.lg} {
    max-width: 100%;
  }

  ${props => props.theme.breakpoints.md} {
    margin-top: 0;
  }

  > section {
    display: flex;
    align-items: center;
  }

  img {
    cursor: pointer;
    max-width: initial;
  }

  div > div {
    margin-bottom: 2rem;
  }

  div {
    margin: 1rem;
  }

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const Button = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
`;

export const Wrapper = styled.div`
  width: 324px;
  height: ${props => (props.big ? '548px' : '420px')};

  ${props => props.theme.breakpoints.md} {
    width: ${324 * 0.7}px;
    height: ${props => (props.big ? 548 * 0.7 : 420 * 0.7)}px;
  }

  ${props => props.theme.breakpoints.sm} {
    width: ${324 * 0.5}px;
    height: ${props => (props.big ? 548 * 0.5 : 420 * 0.5)}px;
  }
`;

export const Image = styled.img`
  ${props => props.theme.breakpoints.md} {
    width: ${324 * 0.7}px;
    height: ${props => (props.big ? 548 * 0.7 : 420 * 0.7)}px;
  }

  ${props => props.theme.breakpoints.sm} {
    width: ${324 * 0.5}px;
    height: ${props => (props.big ? 548 * 0.5 : 420 * 0.5)}px;
  }
`;

export const Iframe = styled.iframe`
  width: 324px;
  height: ${props => (props.big ? '548px' : '420px')};
  border: 0;
  border-radius: 4;
  overflow: hidden;
`;
