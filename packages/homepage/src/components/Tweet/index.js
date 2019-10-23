import React from 'react';
import { TweetsWrapper, Quote, Info, Avatar, Author } from './elements';

const Tweet = ({ right, tweet: { name, job, quote, url, username } }) => (
  <TweetsWrapper href={url} target="_blank" right={right}>
    <Quote>“{quote}”</Quote>
    <Author>
      <Avatar src={`https://avatars.io/twitter/${username}`} alt={name} />
      <div>
        <Info>{name}</Info>
        <Info>{job}</Info>
      </div>
    </Author>
  </TweetsWrapper>
);

export default Tweet;
