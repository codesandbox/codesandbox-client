import styled, { css } from 'styled-components';

export const TwitterCSS = css`
  .CallToAction {
    display: none;
  }

  .EmbeddedTweet {
    border: none;
    background-color: ${props => props.theme.background2};
  }

  .TweetInfo {
    display: none;
  }

  .EmbeddedTweet--cta .EmbeddedTweet-tweet {
    padding-bottom: 20px;
  }

  .Tweet {
    font-family: 'Source Sans Pro', 'Open Sans', 'Segoe UI', sans-serif;
    line-height: 24px;
    font-size: 18px;

    color: ${props => props.theme.lightText};
  }
`;

export const List = styled.div`
  display: flex;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  margin-bottom: 100px;

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.lightText};
    outline: 1px solid ${props => props.theme.lightText};
  }

  > div {
    margin-right: 32px;
  }
`;
