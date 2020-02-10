import React, { MouseEvent } from 'react';
import VERSION from '@codesandbox/common/lib/version';
import { useOvermind } from 'app/overmind';
import { css } from '@styled-system/css';
import { Button, Stack, Text, Element, Link } from '@codesandbox/components';
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
      <Element
        marginBottom={3}
        css={css({
          paddingX: 2,
        })}
      >
        <Stack gap={2}>
          {links.map(link => (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              css={css({ color: 'sideBar.border' })}
              href={link.href}
            >
              {link.icon}
            </Link>
          ))}
        </Stack>
        <Text
          size={1}
          block
          css={css({ color: 'sideBar.border', textAlign: 'right' })}
        >
          {VERSION}
        </Text>
      </Element>
    </Element>
  );
};
