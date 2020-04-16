import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import { captureException } from '@codesandbox/common/lib/utils/analytics/sentry';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
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
import { Selection } from 'ot';
import * as uuid from 'uuid';

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
      isOptimistic: true,
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

export const getCommentReplies: AsyncAction<string> = async (
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
      (DIALOG_TRANSITION_DURATION + REPLY_TRANSITION_DELAY) * 1000,
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

  actions.comments.getCommentReplies(commentId);

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
        comment.references[0].metadata
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
  const sandbox = state.editor.currentSandbox;
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
      lastUpdatedAt: state.editor.currentModule.updatedAt,
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
            id: uuid.v4(),
            type: 'code',
            metadata: codeReference,
            resource: state.editor.currentModule.path,
          },
        ]
      : [],
    replyCount: 0,
  };
  const comments = state.comments.comments;

  if (!comments[sandbox.id]) {
    comments[sandbox.id] = {};
  }

  comments[sandbox.id][id] = optimisticComment;
  // placeholder value until we know the correct values
  const {
    left,
    right,
    top,
    bottom,
  } = await effects.vscode.getCodeReferenceBoundary(
    id,
    optimisticComment.references[0].metadata
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
  isOptimistic?: boolean;
}> = async ({ state, effects }, { content, parentCommentId, isOptimistic }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const sandbox = state.editor.currentSandbox;
  const sandboxId = sandbox.id;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  const comments = state.comments.comments;

  if (!comments[sandboxId]) {
    comments[sandboxId] = {};
  }

  const id = uuid.v4();
  let optimisticComment: CommentFragment;
  if (isOptimistic) {
    optimisticComment = {
      ...state.comments.comments[sandboxId][OPTIMISTIC_COMMENT_ID],
      id,
    };
    state.comments.comments[sandboxId][id] = optimisticComment;
    state.comments.currentCommentId = state.comments.currentCommentId
      ? id
      : null;
    delete state.comments.comments[sandboxId][OPTIMISTIC_COMMENT_ID];
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
      replyCount: 0,
    };
    comments[sandboxId][id] = optimisticComment;
  }

  state.comments.selectedCommentsFilter = CommentsFilterOption.OPEN;

  if (parentCommentId) {
    comments[sandboxId][parentCommentId].replyCount++;
  }

  // The server might be ahead on sandbox version, so we need to try to save
  // several times
  let tryCount = 0;

  async function saveComment() {
    tryCount++;
    await effects.gql.mutations.createComment({
      id,
      parentCommentId: parentCommentId || null,
      sandboxId,
      content,
      codeReference: optimisticComment.references.length
        ? {
            ...optimisticComment.references[0].metadata,
            lastUpdatedAt: sandbox.modules.find(
              module =>
                module.path === optimisticComment.references[0].metadata.path
            )!.updatedAt,
          }
        : null,
    });
  }

  try {
    await saveComment();
  } catch (error) {
    if (error.response?.data?.error === 'old_version' && tryCount < 3) {
      await saveComment();
    } else {
      captureException(error);
      effects.notificationToast.error(
        'Unable to create your comment, please try again'
      );
      delete comments[sandboxId][id];
    }
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
  delete comments[sandboxId][commentId];

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
  if (comment.references[0] && comment.references[0].type === 'code') {
    const codeReference = comment.references[0].metadata;
    const sandbox = state.editor.currentSandbox;
    if (!sandbox) {
      return;
    }

    const module = sandbox.modules.find(
      moduleItem => moduleItem.path === codeReference.path
    );

    if (!module) {
      return;
    }

    // We create a diff operation which is applied to the comment to ensure
    // any operations received in the meantime is applied
    const diffOperation = getTextOperation(
      module.savedCode || module.code,
      module.code
    );
    const range = new Selection.Range(codeReference.anchor, codeReference.head);
    const newRange = range.transform(diffOperation);

    codeReference.anchor = newRange.anchor;
    codeReference.head = newRange.head;
  }

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
