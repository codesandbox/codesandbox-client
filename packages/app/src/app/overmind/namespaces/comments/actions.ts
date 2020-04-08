import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import {
  DIALOG_TRANSITION_DURATION,
  REPLY_TRANSITION_DELAY,
} from 'app/constants';
import {
  CodeReference,
  CommentAddedSubscription,
  CommentChangedSubscription,
  CommentFragment,
  CommentRemovedSubscription,
} from 'app/graphql/types';
import { Action, AsyncAction } from 'app/overmind';
import { utcToZonedTime } from 'date-fns-tz';

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
      // No idea why TS complains about this
      // @ts-ignore
      sandbox: { comment },
    } = await effects.browser.waitAtLeast(
      DIALOG_TRANSITION_DURATION + REPLY_TRANSITION_DELAY,
      () =>
        effects.gql.queries.comment({
          sandboxId: sandbox.id,
          commentId,
        })
    );

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
  if (
    state.comments.currentCommentId &&
    commentIds.includes(state.comments.currentCommentId)
  ) {
    actions.comments.closeComment();
    return;
  }

  if (!commentIds.length) {
    actions.comments.createComment();
  } else if (commentIds.length === 1) {
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
  if (!state.editor.currentSandbox) {
    return;
  }

  if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
    delete state.comments.comments[state.editor.currentSandbox.id][
      OPTIMISTIC_COMMENT_ID
    ];
  }

  state.comments.currentCommentId = null;
  state.comments.currentCommentPositions = null;
};

export const closeMultiCommentsSelector: Action = ({ state }) => {
  state.comments.multiCommentsSelector = null;
};

export const selectComment: AsyncAction<{
  commentId: string;
  bounds?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}> = async ({ state, effects, actions }, { commentId, bounds }) => {
  actions.comments.closeMultiCommentsSelector();

  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const comment = state.comments.comments[sandbox.id][commentId];

  actions.comments.getComments(commentId);

  if (!bounds) {
    state.comments.currentCommentId = commentId;
    return;
  }

  if (
    comment &&
    comment.references.length &&
    comment.references[0].type === 'code'
  ) {
    if (module) {
      await actions.editor.moduleSelected({
        path: comment.references[0].metadata.path,
      });

      // update comment position with precise info
      const referenceBounds = await effects.vscode.getCodeReferenceBoundary(
        commentId,
        comment.references[0]
      );

      if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
        delete state.comments.comments[sandbox.id][OPTIMISTIC_COMMENT_ID];
      }

      state.comments.currentCommentId = commentId;
      state.comments.currentCommentPositions = {
        trigger: bounds,
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

export const createComment: AsyncAction = async ({ state, effects }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = OPTIMISTIC_COMMENT_ID;
  const sandboxId = state.editor.currentSandbox.id;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  let codeReference: CodeReference | null = null;
  const selection = state.live.currentSelection;
  if (selection) {
    codeReference = {
      anchor:
        selection.primary.selection[0] || selection.primary.cursorPosition,
      head: selection.primary.selection[1] || selection.primary.cursorPosition,
      code: selection.primary.selection.length
        ? state.editor.currentModule.code.substr(
            selection.primary.selection[0],
            selection.primary.selection[1] - selection.primary.selection[0]
          )
        : '',
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

  if (!comments[sandboxId]) {
    comments[sandboxId] = {};
  }

  comments[sandboxId][id] = optimisticComment;
  // placeholder value until we know the correct values
  const {
    left,
    right,
    top,
    bottom,
  } = await effects.vscode.getCodeReferenceBoundary(
    id,
    optimisticComment.references[0]
  );
  state.comments.currentCommentId = id;
  state.comments.currentCommentPositions = {
    trigger: {
      left,
      top,
      bottom,
      right,
    },
    dialog: {
      left,
      top,
      bottom,
      right,
    },
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
  const sandbox = state.editor.currentSandbox;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  const comments = state.comments.comments;

  if (!comments[sandbox.id]) {
    comments[sandbox.id] = {};
  }

  let optimisticComment: CommentFragment;
  if (state.comments.comments[sandbox.id][id]) {
    optimisticComment = state.comments.comments[sandbox.id][id];
  } else {
    optimisticComment = {
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
      references: [],
      comments: [],
    };
    comments[sandbox.id][id] = optimisticComment;
  }

  if (optimisticComment.parentComment) {
    comments[sandbox.id][optimisticComment.parentComment.id].comments.push({
      id,
    });
  }
  state.comments.selectedCommentsFilter = CommentsFilterOption.OPEN;

  try {
    const response = await effects.gql.mutations.createComment({
      parentCommentId: parentCommentId || null,
      sandboxId: sandbox.id,
      content,
      codeReference: optimisticComment.references.length
        ? optimisticComment.references[0].metadata
        : null,
    });

    const comment = response.createComment;

    delete comments[sandbox.id][id];
    comments[sandbox.id][comment.id] = comment;

    if (parentCommentId) {
      comments[sandbox.id][parentCommentId].comments.push({
        id: comment.id,
      });
      comments[sandbox.id][parentCommentId].comments.splice(
        comments[sandbox.id][parentCommentId].comments.findIndex(
          childComment => childComment.id === id
        ),
        1
      );
    }

    if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
      state.comments.currentCommentId = comment.id;
      delete comments[sandbox.id][OPTIMISTIC_COMMENT_ID];
    }
  } catch (error) {
    effects.notificationToast.error(
      'Unable to create your comment, please try again'
    );
    delete comments[sandbox.id][id];
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
  const parentComment =
    deletedComment.parentComment &&
    comments[sandboxId][deletedComment.parentComment.id];
  delete comments[sandboxId][commentId];
  let replyIndex: number = -1;

  if (parentComment) {
    replyIndex = parentComment.comments.findIndex(
      reply => reply.id === deletedComment.id
    );
    parentComment.comments.splice(replyIndex, 1);
  }

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
    if (parentComment) {
      parentComment.comments.splice(replyIndex, 0, { id: deletedComment.id });
    }
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
    await (isResolved
      ? effects.gql.mutations.resolveComment({
          commentId,
          sandboxId,
        })
      : effects.gql.mutations.unresolveComment({
          commentId,
          sandboxId,
        }));
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

export const getSandboxComments: AsyncAction<string> = async (
  { state, effects, actions },
  sandboxId
) => {
  try {
    const { sandbox: sandboxComments } = await effects.gql.queries.comments({
      sandboxId,
    });

    if (!sandboxComments || !sandboxComments.comments) {
      return;
    }

    state.comments.comments[sandboxId] = sandboxComments.comments.reduce<{
      [id: string]: CommentFragment;
    }>((aggr, commentThread) => {
      aggr[commentThread.id] = commentThread;

      return aggr;
    }, {});

    const urlCommentId = effects.router.getCommentId();
    if (urlCommentId) {
      actions.workspace.setWorkspaceItem({ item: 'comments' });
      actions.comments.selectComment({
        commentId: urlCommentId,
        bounds: {
          left: effects.browser.getWidth() / 2,
          top: 80,
          right: effects.browser.getWidth() / 3,
          bottom: 0,
        },
      });
    }

    effects.gql.subscriptions.commentAdded.dispose();
    effects.gql.subscriptions.commentChanged.dispose();
    effects.gql.subscriptions.commentRemoved.dispose();

    effects.gql.subscriptions.commentAdded(
      {
        sandboxId,
      },
      actions.comments.onCommentAdded
    );
    effects.gql.subscriptions.commentChanged(
      {
        sandboxId,
      },
      actions.comments.onCommentChanged
    );
    effects.gql.subscriptions.commentRemoved(
      {
        sandboxId,
      },
      actions.comments.onCommentRemoved
    );
  } catch (e) {
    state.comments.comments[sandboxId] = {};
    effects.notificationToast.notice(
      `There as a problem getting the sandbox comments`
    );
  }
};

export const onCommentAdded: Action<CommentAddedSubscription> = (
  { state },
  { commentAdded: comment }
) => {
  state.comments.comments[comment.sandbox.id][comment.id] = comment;
};

export const onCommentChanged: Action<CommentChangedSubscription> = (
  { state },
  { commentChanged: comment }
) => {
  Object.assign(
    state.comments.comments[comment.sandbox.id][comment.id],
    comment
  );
};

export const onCommentRemoved: Action<CommentRemovedSubscription> = (
  { state },
  { commentRemoved: comment }
) => {
  delete state.comments.comments[comment.sandbox.id][comment.id];
};
