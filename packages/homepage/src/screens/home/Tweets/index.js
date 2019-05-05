import React, { Component } from 'react';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import theme from '@codesandbox/common/lib/theme';
import tweets from './tweets';
import shuffle from '../../../utils/shuffleArray';

import { TwitterCSS, List } from './elements';

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
          ))}
        </List>
      </MaxWidth>
    );
  }
}
