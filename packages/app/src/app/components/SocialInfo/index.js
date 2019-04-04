import React from 'react';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import GithubIcon from 'react-icons/lib/fa/github';
import { Icon } from './elements';
import SpectrumIcon from './SpectrumLogo';

export default ({ ...props }) => (
  <div {...props}>
    <Icon
      href="https://twitter.com/codesandbox"
      target="_blank"
      rel="noopener noreferrer"
    >
      <TwitterIcon />
    </Icon>
    <Icon
      href="https://github.com/CompuIves/codesandbox-client"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubIcon />
    </Icon>
    <Icon
      href="https://spectrum.chat/codesandbox"
      target="_blank"
      rel="noopener noreferrer"
    >
      <SpectrumIcon />
    </Icon>
  </div>
);
