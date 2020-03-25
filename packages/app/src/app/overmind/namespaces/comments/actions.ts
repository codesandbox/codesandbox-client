import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import { CodeReference, CommentFragment } from 'app/graphql/types';
import { Action, AsyncAction } from 'app/overmind';

import { OPTIMISTIC_COMMENT_ID } from './state';

export const selectCommentsFilter: Action<CommentsFilterOption> = (
  { state },
  option
) => {
  state.comments.selectedCommentsFilter = option;
};

export const updateComment: AsyncAction<{
  commentId: string;
  content: string;
}> = async ({ actions, effects, state }, { commentId, content }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  if (commentId === OPTIMISTIC_COMMENT_ID) {
    await actions.comments.addComment({
      content,
    });
    return;
  }
  const id = commentId;
  const sandboxId = state.editor.currentSandbox.id;
  const comment = state.comments.comments[sandboxId][id];

  comment.content = content;

  try {
    await effects.gql.mutations.updateComment({
      commentId,
      content,
      sandboxId,
      isResolved: comment.isResolved,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
  }
};

export const getComments: AsyncAction<string> = async (
  { state, effects },
  commentId
) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }

  try {
    const {
      sandbox: { comment },
    } = await effects.gql.queries.comment({
      sandboxId: sandbox.id,
      commentId,
    });

    comment.comments.forEach(childComment => {
      state.comments.comments[sandbox.id][childComment.id] = childComment;
    });
  } catch (e) {
    effects.notificationToast.error(
      'Unable to get your comment, please try again'
    );
  }
};

export const onCommentClick: Action<{
  commentIds: string[];
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}> = ({ state, actions }, { commentIds, bounds }) => {
  if (commentIds.length === 1) {
    actions.comments.selectComment({
      commentId: commentIds[0],
      bounds,
    });
  } else {
    state.comments.multiCommentsSelector = {
      ids: commentIds,
      x: bounds.left,
      y: bounds.top,
    };
  }
};

export const closeComment: Action = ({ state }) => {
  state.comments.currentCommentId = null;
  state.comments.currentCommentPositions = null;
};

export const selectComment: AsyncAction<{
  commentId: string;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}> = async ({ state, effects, actions }, { commentId, bounds }) => {
  if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
    delete state.comments.comments[state.editor.currentSandbox.id][
      OPTIMISTIC_COMMENT_ID
    ];
  }

  // Should close from somewhere else probably
  state.comments.multiCommentsSelector = null;

  const sandbox = state.editor.currentSandbox;
  const comment = state.comments.comments[sandbox.id][commentId];

  actions.comments.getComments(commentId);

  if (
    comment &&
    comment.references.length &&
    comment.references[0].type === 'code'
  ) {
    if (module) {
      await actions.editor.moduleSelected({
        path: comment.references[0].metadata.path,
      });

      state.comments.currentCommentId = commentId;

      // update comment position with precise info
      const referenceBounds = await effects.vscode.getCodeReferenceBoundary(
        commentId,
        comment.references[0]
      );
      const existingDialogBounds =
        state.comments.currentCommentPositions?.dialog;
      state.comments.currentCommentPositions = {
        trigger: existingDialogBounds || bounds,
        dialog: {
          left: referenceBounds.left,
          top: referenceBounds.top,
          bottom: referenceBounds.bottom,
          right: referenceBounds.right,
        },
      };
    }
  } else {
    state.comments.currentCommentId = commentId;
    state.comments.currentCommentPositions = {
      trigger: bounds,
      dialog: null,
    };
  }
};

export const createComment: Action = ({ state }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = OPTIMISTIC_COMMENT_ID;
  const sandboxId = state.editor.currentSandbox.id;
  const now = new Date().toString();
  let codeReference: CodeReference = null;
  const selection = state.live.currentSelection;
  if (selection) {
    codeReference = {
      anchor: selection.primary.selection[0],
      head: selection.primary.selection[1],
      code: state.editor.currentModule.code.substr(
        selection.primary.selection[0],
        selection.primary.selection[1] - selection.primary.selection[0]
      ),
      path: state.editor.currentModule.path,
    };
  }

  const optimisticComment: CommentFragment = {
    parentComment: null,
    id,
    insertedAt: now,
    updatedAt: now,
    content: '',
    isResolved: false,
    user: {
      id: state.user.id,
      name: state.user.name,
      username: state.user.username,
      avatarUrl: state.user.avatarUrl,
    },
    references: codeReference
      ? [
          {
            id: '__OPTIMISTIC__',
            type: 'code',
            metadata: codeReference,
            resource: state.editor.currentModule.path,
          },
        ]
      : [],
    comments: [],
  };
  const comments = state.comments.comments;

  comments[sandboxId][id] = optimisticComment;
  state.comments.currentCommentId = id;
  // placeholder value until we know the correct values
  state.comments.currentCommentPositions = {
    trigger: { top: 120, right: 300, left: 0, bottom: 0 },
    dialog: null,
  };
};

export const addComment: AsyncAction<{
  content: string;
  parentCommentId?: string;
}> = async ({ state, effects }, { content, parentCommentId }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = OPTIMISTIC_COMMENT_ID;
  const sandboxId = state.editor.currentSandbox.id;
  const now = new Date().toString();
  let codeReference: CodeReference = null;
  const selection = state.live.currentSelection;
  if (selection && selection.primary.selection.length) {
    codeReference = {
      anchor: selection.primary.selection[0],
      head: selection.primary.selection[1],
      code: state.editor.currentModule.code.substr(
        selection.primary.selection[0],
        selection.primary.selection[1] - selection.primary.selection[0]
      ),
      path: state.editor.currentModule.path,
    };
  }

  const optimisticComment: CommentFragment = {
    parentComment: parentCommentId ? { id: parentCommentId } : null,
    id,
    insertedAt: now,
    updatedAt: now,
    content,
    isResolved: false,
    user: {
      id: state.user.id,
      name: state.user.name,
      username: state.user.username,
      avatarUrl: state.user.avatarUrl,
    },
    references: codeReference
      ? [
          {
            id: '__OPTIMISTIC__',
            type: 'code',
            metadata: codeReference,
            resource: state.editor.currentModule.path,
          },
        ]
      : [],
    comments: [],
  };
  const comments = state.comments.comments;

  comments[sandboxId][id] = optimisticComment;

  if (optimisticComment.parentComment) {
    comments[sandboxId][optimisticComment.parentComment.id].comments.push({
      id,
    });
  }
  state.comments.selectedCommentsFilter = CommentsFilterOption.OPEN;

  try {
    let comment: CommentFragment;
    if (codeReference) {
      const response = await effects.gql.mutations.createCodeComment({
        sandboxId,
        content,
        codeReference,
      });
      comment = response.createCodeComment;
    } else {
      const response = await effects.gql.mutations.createComment({
        parentCommentId,
        sandboxId,
        content,
      });
      comment = response.createComment;
    }

    delete comments[sandboxId][id];
    comments[sandboxId][comment.id] = comment;

    if (parentCommentId) {
      comments[sandboxId][parentCommentId].comments.push({
        id: comment.id,
      });
      comments[sandboxId][parentCommentId].comments.splice(
        comments[sandboxId][parentCommentId].comments.findIndex(
          childComment => childComment.id === id
        ),
        1
      );
    }

    if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
      state.comments.currentCommentId = comment.id;
      delete comments[sandboxId][OPTIMISTIC_COMMENT_ID];
    }
  } catch (error) {
    effects.notificationToast.error(
      'Unable to create your comment, please try again'
    );
    delete comments[sandboxId][id];
  }
};

export const deleteComment: AsyncAction<{
  commentId: string;
}> = async ({ state, effects }, { commentId }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const sandboxId = state.editor.currentSandbox.id;
  const comments = state.comments.comments;
  const deletedComment = comments[sandboxId][commentId];

  try {
    await effects.gql.mutations.deleteComment({
      commentId,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to delete your comment, please try again'
    );
    comments[sandboxId][commentId] = deletedComment;
  }
};

export const resolveComment: AsyncAction<{
  commentId: string;
  isResolved: boolean;
}> = async ({ effects, state }, { commentId, isResolved }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const comments = state.comments.comments;
  const sandboxId = state.editor.currentSandbox.id;
  const oldIsResolved = comments[sandboxId][commentId].isResolved;

  comments[sandboxId][commentId].isResolved = isResolved;

  try {
    await effects.gql.mutations.updateComment({
      commentId,
      isResolved,
      content: comments[sandboxId][commentId].content,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
    comments[sandboxId][commentId].isResolved = oldIsResolved;
  }
};

export const copyPermalinkToClipboard: Action<string> = (
  { effects },
  commentId
) => {
  effects.browser.copyToClipboard(effects.router.createCommentUrl(commentId));
  effects.notificationToast.success('Comment permalink copied to clipboard');
};
