import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import { CommentFragment, CommentWithRepliesFragment } from 'app/graphql/types';
import { Derive } from 'app/overmind';

export const OPTIMISTIC_COMMENT_ID = '__OPTIMISTIC_COMMENT_ID__';

type State = {
  comments: {
    [sandboxId: string]: {
      [commentId: string]: CommentFragment;
    };
  };
  currentComments: Derive<State, CommentFragment[]>;
  selectedCommentsFilter: CommentsFilterOption;
  currentCommentId: string | null;
  currentCommentPositions: {
    trigger: { left: number; top: number; right: number; bottom: number };
    dialog: { left: number; top: number } | null;
  } | null;
  currentComment: Derive<State, CommentWithRepliesFragment | null>;
  fileComments: Derive<
    State,
    {
      [path: string]: Array<{
        commentId: string;
        range: [number, number];
      }>;
    }
  >;
  multiCommentsSelector: {
    ids: string[];
    x: number;
    y: number;
  } | null;
};

export const state: State = {
  multiCommentsSelector: null,
  currentCommentPositions: null,
  comments: {},
  currentCommentId: null,
  fileComments: ({ currentComments }) =>
    currentComments.reduce<{
      [path: string]: Array<{
        commentId: string;
        range: [number, number];
      }>;
    }>((aggr, comment) => {
      comment.references.forEach(reference => {
        if (reference.type === 'code') {
          if (!aggr[reference.metadata.path]) {
            aggr[reference.metadata.path] = [];
          }
          aggr[reference.metadata.path].push({
            commentId: comment.id,
            range: [reference.metadata.anchor, reference.metadata.head],
          });
        }
      });

      return aggr;
    }, {}),
  currentComment: (
    { comments, currentCommentId },
    { editor: { currentSandbox } }
  ) => {
    if (!currentSandbox || !comments[currentSandbox.id] || !currentCommentId) {
      return null;
    }

    return {
      ...comments[currentSandbox.id][currentCommentId],
      comments: comments[currentSandbox.id][currentCommentId].comments.map(
        commentId => comments[currentSandbox.id][commentId.id] || null
      ),
    };
  },
  selectedCommentsFilter: CommentsFilterOption.OPEN,
  currentComments: (
    { comments, selectedCommentsFilter },
    { editor: { currentSandbox } }
  ) => {
    if (!currentSandbox || !comments[currentSandbox.id]) {
      return [];
    }

    function sortByInsertedAt(
      commentA: CommentFragment,
      commentB: CommentFragment
    ) {
      const aDate = new Date(commentA.insertedAt);
      const bDate = new Date(commentB.insertedAt);

      if (aDate > bDate) {
        return -1;
      }

      if (bDate < aDate) {
        return 1;
      }

      return 0;
    }

    const rootComments = Object.values(comments[currentSandbox.id]).filter(
      comment => comment.parentComment == null
    );

    switch (selectedCommentsFilter) {
      case CommentsFilterOption.ALL:
        return rootComments
          .filter(comment => comment.id !== OPTIMISTIC_COMMENT_ID)
          .sort(sortByInsertedAt);
      case CommentsFilterOption.RESOLVED:
        return rootComments
          .filter(
            comment =>
              comment.id !== OPTIMISTIC_COMMENT_ID && comment.isResolved
          )
          .sort(sortByInsertedAt);
      case CommentsFilterOption.OPEN:
        return rootComments
          .filter(
            comment =>
              comment.id !== OPTIMISTIC_COMMENT_ID && !comment.isResolved
          )
          .sort(sortByInsertedAt);
      case CommentsFilterOption.MENTIONS:
        return rootComments
          .filter(comment => comment.id !== OPTIMISTIC_COMMENT_ID)
          .sort(sortByInsertedAt);
      default:
        return [];
    }
  },
};
