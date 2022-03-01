import { Button, Stack, Element, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent, MouseEvent } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { DiscordIcon, GithubIcon, TwitterIcon } from './social-icons';

const links = [
  { href: 'https://twitter.com/codesandbox', Icon: TwitterIcon },
  {
    href: 'https://github.com/codesandbox/codesandbox-client',
    Icon: GithubIcon,
  },
  {
    href: 'https://discord.gg/Pr4ft3gBTx',
    Icon: DiscordIcon,
  },
];

export const Delete: FunctionComponent = () => {
  const {
    modalOpened,
    workspace: { deleteTemplate },
  } = useActions();
  const {
    currentSandbox: { customTemplate },
  } = useAppState().editor;

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  return (
    <Element>
      <Stack justify="center" marginBottom={6}>
        <Button
          css={css({
            ':hover:not(:disabled),:focus:not(:disabled)': {
              color: 'errorForeground',
            },
          })}
          // @ts-ignore
          onClick={onDelete}
          variant="link"
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </Button>
      </Stack>

      <Element marginBottom={3} paddingX={2}>
        <Stack>
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
    </Element>
  );
};
