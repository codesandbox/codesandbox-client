import { Button, Stack, Element, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent, MouseEvent } from 'react';

import { useOvermind } from 'app/overmind';

import { GithubIcon, TwitterIcon } from './icons';

const links = [
  { href: 'https://twitter.com/codesandbox', Icon: TwitterIcon },
  {
    href: 'https://github.com/codesandbox/codesandbox-client',
    Icon: GithubIcon,
  },
];

export const Delete: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      workspace: { deleteTemplate },
    },
    state: {
      editor: {
        currentSandbox: { customTemplate },
      },
    },
  } = useOvermind();

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
          css={css({ ':hover,:focus': { color: 'errorForeground' } })}
          // @ts-ignore
          onClick={onDelete}
          variant="link"
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </Button>
      </Stack>

      <Element marginBottom={3} paddingX={2}>
        <Stack gap={2}>
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
