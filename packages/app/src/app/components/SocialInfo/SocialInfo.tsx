import React from 'react';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import GithubIcon from 'react-icons/lib/fa/github';
import { Icon } from './elements';
import { SpectrumLogo } from '../SpectrumLogo';

export const SocialInfo: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = props => (
  <div {...props}>
    <Icon href="https://twitter.com/codesandbox">
      <TwitterIcon />
    </Icon>
    <Icon href="https://github.com/codesandbox/codesandbox-client">
      <GithubIcon />
    </Icon>
    <Icon href="https://spectrum.chat/codesandbox">
      <SpectrumLogo />
    </Icon>
  </div>
);
