import React from 'react';
import { useOvermind } from 'app/overmind';
import { Link, Button } from '@codesandbox/components';
import css from '@styled-system/css';

export const LinkElement = ({ href, children, ...props }) => {
  const { state, actions } = useOvermind();
  const { id, alias } = state.editor.currentSandbox;
  const commentId = new URLSearchParams(new URL(href).search).get('comment');
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
        })}
        onClick={() => actions.comments.selectComment({ commentId })}
      >
        {children}
      </Button>
    );
  }

  if (!href.includes('codesandbox')) {
    return (
      <Link target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </Link>
    );
  }

  return <Link {...props}>{children}</Link>;
};
