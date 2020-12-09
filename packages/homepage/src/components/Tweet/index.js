import React from 'react';
import { TweetsWrapper, Quote, Info, Avatar, Author } from './elements';

const Tweet = ({
  style,
  right,
  tweet: { name, job, quote, url, username },
}) => (
  <TweetsWrapper css={style} href={url} target="_blank" right={right}>
    <Quote>“{quote}”</Quote>
    <Author>
      <Avatar
        src={`https://twitter-avatar-csb.vercel.app/${username}`}
        alt={name}
      />
      <div>
        <Info>{name}</Info>
        <Info>{job}</Info>
      </div>
    </Author>
  </TweetsWrapper>
);

export default Tweet;
