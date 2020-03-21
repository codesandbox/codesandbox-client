import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import {
  CodeReference,
  CommentFragment,
  CommentThreadFragment,
} from 'app/graphql/types';
import { Action, AsyncAction } from 'app/overmind';

export const selectCommentsFilter: Action<CommentsFilterOption> = (
  { state },
  option
) => {
  state.comments.selectedCommentsFilter = option;
};

export const addComment: AsyncAction<string> = async (
  { state, effects },
  comment
) => {
  const id = state.comments.currentCommentThreadId;

  if (
    !state.comments.currentCommentThread ||
    !id ||
    !state.user ||
    !state.editor.currentSandbox
  ) {
    return;
  }
  const sandboxId = state.editor.currentSandbox.id;
  const fakeId = `${comment}-${state.user.username}`;
  const commentThread = state.comments.commentThreads[sandboxId][id];

  commentThread.comments.push({
    insertedAt: new Date(),
    updatedAt: new Date(),
    id: fakeId,
    content: comment,
    user: {
      id: state.user.id,
      avatarUrl: state.user.avatarUrl,
      name: state.user.name,
      username: state.user.username,
    },
  });

  const optimisticComment =
    commentThread.comments[commentThread.comments.length - 1];

  try {
    const {
      createComment: newComment,
    } = await effects.gql.mutations.createComment({
      commentThreadId: id,
      content: comment,
      sandboxId,
    });

    Object.assign(optimisticComment, newComment);
  } catch (e) {
    commentThread.comments.splice(
      commentThread.comments.indexOf(optimisticComment),
      1
    );
  }
};

export const updateComment: AsyncAction<{
  commentId: string;
  content: string;
  threadId: string;
  reply?: boolean;
}> = async ({ effects, state }, { commentId, content, threadId, reply }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const id = threadId;
  const sandboxId = state.editor.currentSandbox.id;
  const commentThread = state.comments.commentThreads[sandboxId][id];
  const commentToUpdate = reply
    ? commentThread.comments.find(comment => comment.id === commentId)
    : commentThread.initialComment;

  if (!commentToUpdate) {
    return;
  }

  commentToUpdate.content = content;

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

export const getComments: AsyncAction<{
  id: string;
  sandboxId: string;
}> = async ({ state, effects }, { sandboxId, id }) => {
  try {
    const { sandbox } = await effects.gql.queries.comments({
      sandboxId,
      commentThreadId: id,
    });

    if (!sandbox || !sandbox.commentThread) {
      return;
    }

    state.comments.commentThreads[sandboxId][id].comments =
      sandbox.commentThread.comments;
  } catch (e) {
    effects.notificationToast.error(
      'Unable to get your comment, please try again'
    );
  }
};

export const selectCommentThread: Action<string> = ({ state }, id) => {
  state.comments.currentCommentThreadId = id;
};

export const createCommentThread: Action = ({ state }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = state.user.username;
  const sandboxId = state.editor.currentSandbox.id;
  const now = new Date().toString();
  const comment: CommentFragment = {
    id,
    insertedAt: now,
    updatedAt: now,
    content: '',
    user: {
      id: state.user.id,
      name: state.user.name,
      username: state.user.username,
      avatarUrl: state.user.avatarUrl,
    },
  };
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

  const optimisticCommentThread: CommentThreadFragment = {
    id,
    insertedAt: now,
    updatedAt: now,
    reference: codeReference
      ? {
          id: '__OPTIMISTIC__',
          type: 'code',
          metadata: codeReference,
          resource: state.editor.currentModule.path,
        }
      : null,
    isResolved: false,
    initialComment: comment,
    comments: [],
  };
  const commentThreads = state.comments.commentThreads;

  commentThreads[sandboxId][id] = optimisticCommentThread;
  state.comments.creatingCommentThreadId = id;
  state.comments.currentCommentThreadId = id;
};

export const addCommentThread: AsyncAction<{
  content: string;
  open?: boolean;
  edit?: boolean;
}> = async ({ state, effects, actions }, { content, open }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = `${content}-${state.user.username}`;
  const sandboxId = state.editor.currentSandbox.id;
  const now = new Date().toString();
  const comment: CommentFragment = {
    id,
    insertedAt: now,
    updatedAt: now,
    content,
    user: {
      id: state.user.id,
      name: state.user.name,
      username: state.user.username,
      avatarUrl: state.user.avatarUrl,
    },
  };
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

  const optimisticCommentThread: CommentThreadFragment = {
    id,
    insertedAt: now,
    updatedAt: now,
    reference: codeReference
      ? {
          id: '__OPTIMISTIC__',
          type: 'code',
          metadata: codeReference,
          resource: state.editor.currentModule.path,
        }
      : null,
    isResolved: false,
    initialComment: comment,
    comments: [],
  };
  const commentThreads = state.comments.commentThreads;

  commentThreads[sandboxId][id] = optimisticCommentThread;
  state.comments.selectedCommentsFilter = CommentsFilterOption.OPEN;
  try {
    const {
      createCommentThread: commentThread,
    } = await effects.gql.mutations.createCommentThread({
      sandboxId,
      content,
      codeReference,
    });

    delete commentThreads[sandboxId][id];
    commentThreads[sandboxId][commentThread.id] = commentThread;
    if (open) {
      actions.comments.getComments({ id: commentThread.id, sandboxId });
    }
  } catch (error) {
    effects.notificationToast.error(
      'Unable to create your comment, please try again'
    );
    delete commentThreads[sandboxId][id];
  }
};

export const deleteComment: AsyncAction<{
  commentId: string;
  threadId: string;
  reply?: boolean;
}> = async ({ state, effects }, { commentId, threadId, reply }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const sandboxId = state.editor.currentSandbox.id;
  const commentThreads = state.comments.commentThreads;
  const deletedComment = commentThreads[sandboxId][threadId];

  if (reply) {
    const index = commentThreads[sandboxId][threadId].comments.findIndex(
      comment => comment.id === commentId
    );
    commentThreads[sandboxId][threadId].comments.splice(index, 1);
  } else {
    delete commentThreads[sandboxId][threadId];
    state.comments.currentCommentThreadId = null;
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
    commentThreads[sandboxId][threadId] = deletedComment;
  }
};

export const resolveCommentThread: AsyncAction<{
  commentThreadId: string;
  isResolved: boolean;
}> = async ({ effects, state }, { commentThreadId, isResolved }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const commentThreads = state.comments.commentThreads;
  const sandboxId = state.editor.currentSandbox.id;
  const oldIsResolved = commentThreads[sandboxId][commentThreadId].isResolved;
  const currentCommentThread = state.comments.currentCommentThread;
  const updateIsCurrent =
    currentCommentThread &&
    commentThreads[sandboxId][commentThreadId].id === currentCommentThread.id;

  commentThreads[sandboxId][commentThreadId].isResolved = isResolved;

  if (updateIsCurrent && currentCommentThread) {
    currentCommentThread.isResolved = isResolved;
  }

  try {
    await effects.gql.mutations.toggleCommentThreadResolved({
      commentThreadId,
      isResolved,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
    commentThreads[sandboxId][commentThreadId].isResolved = oldIsResolved;
  }
};
