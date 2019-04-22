import React, { Component } from 'react';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import theme from '@codesandbox/common/lib/theme';
import styled, { css } from 'styled-components';
import tweets from './tweets';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TwitterCSS = css`
  .CallToAction {
    display: none;
  }

  .TweetInfo {
    display: none;
  }

  .Tweet {
    font-family: 'Helvetica Neue', 'Roboto';
    font-weight: bold;
    line-height: 24px;
    font-size: 18px;

    color: #f2f2f2;
  }
`;

const List = styled.div`
  display: flex;
  align-items: center;
  overflow: scroll;
  margin-bottom: 100px;

  > div {
    margin-right: 32px;
  }
`;

export default class extends Component {
  componentDidMount() {
    tweets.map(tweet =>
      window.twttr.widgets
        .createTweet(tweet, this[tweet], {
          conversation: 'none',
          cards: 'hidden',
          linkColor: theme.secondary(),
          theme: 'dark',
        })
        .then(el => {
          const childNodes = Array.from(el.shadowRoot.childNodes);
          childNodes.forEach(childNode => {
            if (childNode.nodeName === 'STYLE') {
              childNode.textContent += TwitterCSS;
            }
          });
        })
    );
  }

  render() {
    return (
      <MaxWidth width={1440}>
        <List>
          {shuffle(tweets).map(tweet => (
            <div
              key={tweet}
              ref={c => {
                this[tweet] = c;
              }}
            />
          ))}})}
        </List>
      </MaxWidth>
    );
  }
}
