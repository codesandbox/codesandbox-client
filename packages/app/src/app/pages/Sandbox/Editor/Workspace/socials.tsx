import { Stack, Element, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { DiscordIcon, GithubIcon, TwitterIcon } from './social-icons';

const links = [
  { href: 'https://twitter.com/codesandbox', Icon: TwitterIcon },
  {
    href: 'https://github.com/codesandbox/codesandbox-client',
    Icon: GithubIcon,
  },
  { href: 'https://discord.gg/C6vfhW3H6e', Icon: DiscordIcon },
];

export const Help: FunctionComponent = () => (
  <Element marginBottom={3} paddingX={2}>
    <Stack justify="center">
      {links.map(({ href, Icon }) => (
        <Link
          css={css({ color: 'sideBar.border' })}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon />
        </Link>
      ))}
    </Stack>
  </Element>
);
