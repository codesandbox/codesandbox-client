import { Button, Link, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import React from 'react';

export const LinkElement = ({ href, children, ...props }) => {
  let commentId = null;
  const state = useAppState();
  const actions = useActions();
  const { id, alias } = state.editor.currentSandbox;

  try {
    commentId = new URLSearchParams(new URL(href).search).get('comment');
  } catch {
    commentId = null;
  }

  if (!children.length) {
    return <Text {...props}>{href}</Text>;
  }

  if (href.startsWith('user://')) {
    return (
      <Link
        css={css({
          display: 'inline',
          width: 'auto',
          padding: 0,
          textAlign: 'left',
          color: 'button.background',
          fontSize: 3,
        })}
        href={`/u/${children[0].props.children.substr(1)}`}
        target="_blank"
        onClick={event => event.stopPropagation()}
      >
        {children[0].props.children}
      </Link>
    );
  }

  if (
    href.includes(window.location.href) &&
    (href.includes(id) || href.includes(alias)) &&
    commentId
  ) {
    return (
      <Button
        variant="link"
        css={css({
          display: 'inline',
          width: 'auto',
          padding: 0,
          textAlign: 'left',
        })}
        onClick={() => actions.comments.selectComment({ commentId })}
      >
        {children[0].props.children}
      </Button>
    );
  }

  if (!href.includes('codesandbox')) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer ugc"
        {...props}
      >
        {children[0].props.children}
      </Link>
    );
  }

  return (
    <Link href={href} {...props}>
      {children[0].props.children}
    </Link>
  );
};
