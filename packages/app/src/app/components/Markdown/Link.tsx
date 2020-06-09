import { Button, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

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
          textAlign: 'left',
        })}
        onClick={() => actions.comments.selectComment({ commentId })}
      >
        {children}
      </Button>
    );
  }

  return (
    <Link href={href} {...props} target="_blank">
      {children[0].props.children}
    </Link>
  );
};
