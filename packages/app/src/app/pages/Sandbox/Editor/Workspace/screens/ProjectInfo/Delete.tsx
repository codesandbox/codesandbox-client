import React, { MouseEvent } from 'react';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Button, Stack, Element, Link } from '@codesandbox/components';
import { SpectrumLogo, GithubIcon, TwitterIcon } from './icons';

const links = [
  { href: 'https://twitter.com/codesandbox', icon: <TwitterIcon /> },
  {
    href: 'https://github.com/codesandbox/codesandbox-client',
    icon: <GithubIcon />,
  },
  { href: 'https://spectrum.chat/codesandbox', icon: <SpectrumLogo /> },
];

export const Delete = () => {
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
          // @ts-ignore
          onClick={onDelete}
          variant="link"
          css={css({
            ':hover,:focus': { color: 'errorForeground' },
          })}
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </Button>
      </Stack>
      <Element marginBottom={3} paddingX={2}>
        <Stack gap={2}>
          {links.map(({ href, icon }) => (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              css={css({ color: 'sideBar.border' })}
              href={href}
            >
              {icon}
            </Link>
          ))}
        </Stack>
      </Element>
    </Element>
  );
};
