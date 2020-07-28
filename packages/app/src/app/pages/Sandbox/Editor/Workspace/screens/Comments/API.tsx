// This file imports the necessary files that allow for the comments to be used in the outside world as a plug API
import React from 'react';
import { useOvermind } from 'app/overmind';
import { CommentsGlobalStyles } from './components/GlobalStyles';
import { MultiComment } from './components/MultiComment';
import { CommentDialog } from './Dialog';

export const CommentsAPI = () => {
  const {
    state: { comments },
  } = useOvermind();

  return (
    <>
      <CommentsGlobalStyles />
      {comments.currentCommentId && comments.currentComment ? (
        <CommentDialog comment={comments.currentComment} />
      ) : null}
      {comments.multiCommentsSelector && (
        <MultiComment {...comments.multiCommentsSelector} />
      )}
    </>
  );
};
