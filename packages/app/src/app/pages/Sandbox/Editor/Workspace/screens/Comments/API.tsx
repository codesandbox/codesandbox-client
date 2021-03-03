// This file imports the necessary files that allow for the comments to be used in the outside world as a plug API
import React from 'react';
import { useAppState } from 'app/overmind';
import { CommentsGlobalStyles } from './components/GlobalStyles';
import { MultiComment } from './components/MultiComment';
import { CommentDialog } from './Dialog';

export const CommentsAPI = () => {
  const {
    currentComment,
    currentCommentId,
    multiCommentsSelector,
  } = useAppState().comments;

  return (
    <>
      <CommentsGlobalStyles />
      {currentCommentId && currentComment ? (
        <CommentDialog comment={currentComment} />
      ) : null}
      {multiCommentsSelector && <MultiComment {...multiCommentsSelector} />}
    </>
  );
};
