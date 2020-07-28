import { Button, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

export const LinkElement = ({ href, children, ...props }) => {
  const { state, actions } = useOvermind();
  const { id, alias } = state.editor.currentSandbox;
  const commentId = new URLSearchParams(new URL(href).search).get('comment');

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
