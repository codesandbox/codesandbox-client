import {
  CommentsFilterOption,
  Module,
  UserQuery,
} from '@codesandbox/common/lib/types';
import { captureException } from '@codesandbox/common/lib/utils/analytics/sentry';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import {
  DIALOG_TRANSITION_DURATION,
  REPLY_TRANSITION_DELAY,
} from 'app/constants';
import {
  CodeReference,
  CodeReferenceMetadata,
  CodeReferenceMetadataFragment,
  CommentAddedSubscription,
  CommentChangedSubscription,
  CommentFragment,
  CommentRemovedSubscription,
  ImageReference,
  UserReference,
  UserReferenceMetadata,
  ImageReferenceMetadata,
  PreviewReferenceMetadata,
} from 'app/graphql/types';
import { Action, AsyncAction, Operator } from 'app/overmind';
import {
  convertImagesToImageReferences,
  convertMentionsToMentionLinks,
  convertMentionsToUserReferences,
} from 'app/overmind/utils/comments';
import {
  indexToLineAndColumn,
  lineAndColumnToIndex,
} from 'app/overmind/utils/common';
import { utcToZonedTime } from 'date-fns-tz';
import { Selection, TextOperation } from 'ot';
import { debounce, filter, map, mutate, pipe } from 'overmind';
import * as uuid from 'uuid';

import { OPTIMISTIC_COMMENT_ID } from './state';

const PREVIEW_COMMENT_OFFSET = -500;
const CODE_COMMENT_OFFSET = 500;
const BUBBLE_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC8SURBVHgBxZO9EYJAEIW/PTG3BEogNIQKoBQ7QDvQTrQCCQwMrwMpwdxR3ANkGAIHjoA3czd7P+/b25lbYaBqG8WsSKnIEMJ229bjzUHutuzfl84YRxte5Bru+K8jawUV9tkBWvNVw4hxsgpJHMTUyybzWDP13caDaM2h1vzAR0Ji1Jzjqw+ZYdrThy9I5wEgNMzUXIBdGKBf2x8gnFxf+AIsAXsXTAdo5l8fuGUwylRR6nzRdGe52aJ/9AWAvjArPZuVDgAAAABJRU5ErkJggg==';

const BUBBLE_IMAGE_2X =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFsSURBVHgBxZfBUcMwEEW/5ISzS1AqQNwYLoQOoAJaCBUAHUAHoQOoIOaQGW64A9QBPsMEs5IdBA6ZKImsfTM7icce79f3yt4VCKQe6xwfOIfAKR1qCkWRt6crCkNRUhQY4kkUZRVyX7HpgvpYK0hM6MrLXwlDmGKBW/FSGuwiwK34E9f0d4L9uBPz8grbCGhXPaOzCnEw5MbZf27IleQnWkdOblHIMHP37vDHgR5W3mXFiR8BbZW/9pjcixjiaLlL/COwBdd/cotqi9vhHHDWZ3hDShYY2UfROJDhBqmRzfYW7X5/R3oqqoWRdK9XHtyrXVIVjMEFfVdsDRyCD20FKPChrIBtvnCxySWY4RZQcQsw3AJKbgEFrwBqXjkFTG1PwCeAOmb7wyNA4H7ZlnEIMBj4/mOAtDRN6dxPTSkdMKhx0Z0NUjkQPphEhwrOteFrZsS+HKjI7gd80Vy4YTiNJcCP5zWecYDH0PH8G30scDsRZ7W6AAAAAElFTkSuQmCC';

export const selectCommentsFilter: Action<CommentsFilterOption> = (
  { state },
  option
) => {
  state.comments.selectedCommentsFilter = option;
};

export const updateComment: AsyncAction<{
  commentId: string;
  mentions: { [username: string]: UserQuery };
  images: { [fileName: string]: { src: string; resolution: [number, number] } };
  content: string;
}> = async (
  { actions, effects, state },
  { commentId, content, mentions, images }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  if (commentId === OPTIMISTIC_COMMENT_ID) {
    await actions.comments.saveOptimisticComment({
      content,
      mentions,
    });
    return;
  }
  const id = commentId;
  const sandboxId = state.editor.currentSandbox.id;
  const comment = state.comments.comments[sandboxId][id];

  effects.analytics.track('Comments - Update Comment');

  comment.content = convertMentionsToMentionLinks(content, mentions);

  try {
    await effects.gql.mutations.updateComment({
      commentId,
      content: comment.content,
      sandboxId,
      codeReferences: [],
      imageReferences: Object.keys(images).map(fileName => ({
        fileName,
        resolution: images[fileName].resolution,
        src: images[fileName].src,
        url: '', // Typing issue on backend, need the url here
      })),
      userReferences: Object.keys(mentions).map(username => ({
        username,
        userId: mentions[username].id,
      })),
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
  }
};

export const queryUsers: Operator<string | null> = pipe(
  mutate(({ state }, query) => {
    state.comments.isQueryingUsers = true;
    // We reset the users when we detect a new query being written
    if (query && query.length === 3) {
      state.comments.usersQueryResult = [];
    }
  }),
  debounce(200),
  filter((_, query) => Boolean(query && query.length >= 3)),
  map(({ effects }, query) => effects.api.queryUsers(query!)),
  mutate(({ state }, result) => {
    state.comments.usersQueryResult = result;
    state.comments.isQueryingUsers = false;
  })
);

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
}> = ({ state, effects, actions }, { commentIds, bounds }) => {
  if (
    state.comments.currentCommentId &&
    commentIds.includes(state.comments.currentCommentId)
  ) {
    actions.comments.closeComment();
    return;
  }

  if (!commentIds.length) {
    actions.comments.createCodeLineComment();
  } else if (commentIds.length === 1) {
    effects.analytics.track('Comments - Open Comment');
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

export const closeComment: Action = ({ state, effects }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  if (state.comments.currentCommentId === OPTIMISTIC_COMMENT_ID) {
    delete state.comments.comments[state.editor.currentSandbox.id][
      OPTIMISTIC_COMMENT_ID
    ];
  }

  effects.analytics.track('Comments - Close Comments');

  // When closing comments we want to move back to previous mode. This
  // is related to users skimming through existing comments. But
  // you can also close an optimistic preview comment, meaning you
  // want to stay in the same mode as you probably want to add a new comment
  if (state.comments.currentCommentId !== OPTIMISTIC_COMMENT_ID) {
    state.preview.mode = state.preview.previousMode;
    state.preview.previousMode = null;
  }

  state.comments.currentCommentId = null;
  state.comments.currentCommentPositions = null;

  if (state.preview.mode === 'add-comment') {
    state.preview.mode = null;
  } else if (state.preview.mode === 'responsive-add-comment') {
    state.preview.mode = 'responsive';
  }
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

  if (comment.anchorReference && comment.anchorReference.type === 'code') {
    if (module) {
      await actions.editor.moduleSelected({
        path: (comment.anchorReference
          .metadata as CodeReferenceMetadataFragment).path,
      });

      // update comment position with precise info
      const referenceBounds = await effects.vscode.getCodeReferenceBoundary(
        commentId,
        comment.anchorReference.metadata as CodeReferenceMetadata
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
  } else if (
    comment.anchorReference &&
    comment.anchorReference.type === 'preview'
  ) {
    const metadata = comment.anchorReference
      .metadata as PreviewReferenceMetadata;

    const previewBounds = await effects.preview.getIframeBoundingRect();
    // if it wasn't in preview mode do not put it in preview mode
    if (metadata.responsive) {
      state.preview.responsive.resolution = [metadata.width, metadata.height];
      state.preview.previousMode = state.preview.mode;
      state.preview.mode = 'responsive';
    } else {
      state.preview.mode = null;
    }

    state.comments.currentCommentId = commentId;

    // We have to wait for the bubble to appear
    await Promise.resolve();

    const left = previewBounds.left + PREVIEW_COMMENT_OFFSET;
    const top = previewBounds.top;
    state.comments.currentCommentPositions = {
      trigger: bounds,
      dialog: {
        // never go over the left of the screen
        left: left >= 20 ? left : 20,
        top,
        bottom: top,
        right: left,
      },
    };
  } else {
    state.comments.currentCommentId = commentId;
    state.comments.currentCommentPositions = {
      trigger: bounds,
      dialog: null,
    };
  }
};

export const createCodeLineComment: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const selection = state.live.currentSelection!;
  const codeLines = state.editor.currentModule.code.split('\n');
  const { lineNumber } = indexToLineAndColumn(
    codeLines,
    selection.primary.selection[0] || selection.primary.cursorPosition
  );
  const anchor = lineAndColumnToIndex(codeLines, lineNumber, 1);

  effects.analytics.track('Comments - Compose Comment', {
    type: 'code',
    isLineComment: true,
  });

  actions.comments.addOptimisticCodeComment({
    __typename: 'CodeReferenceMetadata',
    sandboxId: state.editor.currentSandbox!.id,
    anchor,
    head: anchor,
    code: state.editor.currentModule.code.substr(
      anchor,
      lineAndColumnToIndex(codeLines, lineNumber + 1, 1)
    ),
    path: state.editor.currentModule.path,
  });
};

export const createCodeComment: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const selection = state.live.currentSelection!;

  effects.analytics.track('Comments - Compose Comment', {
    type: 'code',
    isLineComment: false,
  });

  actions.comments.addOptimisticCodeComment({
    __typename: 'CodeReferenceMetadata',
    sandboxId: state.editor.currentSandbox!.id,
    anchor: selection.primary.selection[0] || selection.primary.cursorPosition,
    head: selection.primary.selection[1] || selection.primary.cursorPosition,
    code: selection.primary.selection.length
      ? state.editor.currentModule.code.substr(
          selection.primary.selection[0],
          selection.primary.selection[1] - selection.primary.selection[0]
        )
      : '',
    path: state.editor.currentModule.path,
  });
};

export const addOptimisticCodeComment: AsyncAction<CodeReferenceMetadata> = async (
  { state, effects },
  codeReference
) => {
  const sandbox = state.editor.currentSandbox!;
  const user = state.user!;
  const id = OPTIMISTIC_COMMENT_ID;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  const comments = state.comments.comments;
  const optimisticComment: CommentFragment = {
    parentComment: null,
    id,
    anchorReference: {
      id: uuid.v4(),
      type: 'code',
      metadata: codeReference,
      resource: state.editor.currentModule.path,
    },
    insertedAt: now,
    updatedAt: now,
    content: '',
    isResolved: false,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
    references: [],
    replyCount: 0,
  };

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
  } = await effects.vscode.getCodeReferenceBoundary(id, codeReference);

  state.comments.currentCommentId = id;
  state.comments.currentCommentPositions = {
    trigger: {
      left,
      top,
      bottom,
      right: right + CODE_COMMENT_OFFSET,
    },
    dialog: {
      left: left + CODE_COMMENT_OFFSET,
      top,
      bottom,
      right,
    },
  };
};

export const addOptimisticPreviewComment: AsyncAction<{
  x: number;
  y: number;
  scale: number;
  screenshot: string;
}> = async ({ state, effects }, { x, y, scale, screenshot }) => {
  effects.analytics.track('Comments - Create Optimistic Preview Comment');

  const sandbox = state.editor.currentSandbox!;
  const user = state.user!;
  const id = OPTIMISTIC_COMMENT_ID;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  const comments = state.comments.comments;
  const previewIframeBounds = await effects.preview.getIframeBoundingRect();
  const previewPath = await effects.preview.getPreviewPath();
  const screenshotUrl = await effects.preview.createScreenshot({
    screenshotSource: screenshot,
    bubbleSource: window.devicePixelRatio > 1 ? BUBBLE_IMAGE_2X : BUBBLE_IMAGE,
    cropWidth: 1000,
    cropHeight: 400,
    x: Math.round(x),
    y: Math.round(y),
    scale,
  });
  const isResponsive = state.preview.mode === 'responsive-add-comment';
  const metadata: PreviewReferenceMetadata = {
    userAgent: effects.browser.getUserAgent(),
    responsive: isResponsive,
    screenshotUrl,
    width: isResponsive
      ? state.preview.responsive.resolution[0]
      : previewIframeBounds.width,
    height: isResponsive
      ? state.preview.responsive.resolution[1]
      : previewIframeBounds.height,
    x: isResponsive ? Math.round(x * (1 / scale)) : x,
    y: isResponsive ? Math.round(y * (1 / scale)) : y,
    previewPath,
  };
  const optimisticComment: CommentFragment = {
    parentComment: null,
    id,
    anchorReference: {
      id: uuid.v4(),
      type: 'preview',
      metadata,
      resource: previewPath,
    },
    insertedAt: now,
    updatedAt: now,
    content: '',
    isResolved: false,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
    references: [],
    replyCount: 0,
  };

  if (!comments[sandbox.id]) {
    comments[sandbox.id] = {};
  }

  comments[sandbox.id][id] = optimisticComment;
  state.comments.currentCommentId = id;

  const left = x + previewIframeBounds.left;
  const top = y + previewIframeBounds.top;
  const bottom = top;
  const right = left;

  state.comments.currentCommentPositions = {
    trigger: {
      left,
      top,
      bottom,
      right: right + PREVIEW_COMMENT_OFFSET,
    },
    dialog: {
      left: left + PREVIEW_COMMENT_OFFSET,
      top,
      bottom,
      right,
    },
  };
};

export const saveOptimisticComment: AsyncAction<{
  content: string;
  mentions: { [username: string]: UserQuery };
}> = async ({ state, actions }, { content: rawContent, mentions }) => {
  const sandbox = state.editor.currentSandbox!;
  const sandboxId = sandbox.id;
  const id = uuid.v4();
  const content = convertMentionsToMentionLinks(rawContent, mentions);
  const comment = {
    ...state.comments.comments[sandboxId][OPTIMISTIC_COMMENT_ID],
    content,
    id,
  };
  state.comments.comments[sandbox.id][id] = comment;
  state.comments.currentCommentId = state.comments.currentCommentId ? id : null;
  delete state.comments.comments[sandbox.id][OPTIMISTIC_COMMENT_ID];

  if (state.preview.mode === 'responsive-add-comment') {
    state.preview.mode = 'responsive';
  } else {
    state.preview.mode = null;
  }

  return actions.comments.saveComment(comment);
};

export const saveNewComment: AsyncAction<{
  content: string;
  mentions: { [username: string]: UserQuery };
  images: {
    [fileName: string]: {
      src: string;
      resolution: [number, number];
    };
  };
  parentCommentId?: string;
}> = async (
  { state, actions },
  { content: rawContent, mentions, images, parentCommentId }
) => {
  const user = state.user!;
  const sandbox = state.editor.currentSandbox!;
  const now = utcToZonedTime(new Date().toISOString(), 'Etc/UTC');
  const comments = state.comments.comments;

  if (!comments[sandbox.id]) {
    comments[sandbox.id] = {};
  }

  const id = uuid.v4();
  const content = convertMentionsToMentionLinks(rawContent, mentions);
  const comment: CommentFragment = {
    parentComment: parentCommentId ? { id: parentCommentId } : null,
    anchorReference: null,
    id,
    insertedAt: now,
    updatedAt: now,
    content,
    isResolved: false,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
    references: [
      ...convertMentionsToUserReferences(mentions),
      ...convertImagesToImageReferences(images),
    ],
    replyCount: 0,
  };

  return actions.comments.saveComment(comment);
};

export const saveComment: AsyncAction<CommentFragment> = async (
  { state, effects },
  comment
) => {
  const comments = state.comments.comments;
  const sandbox = state.editor.currentSandbox!;

  state.comments.selectedCommentsFilter = CommentsFilterOption.OPEN;
  comments[sandbox.id][comment.id] = comment;

  if (comment.parentComment) {
    comments[sandbox.id][comment.parentComment.id].replyCount++;
  }

  effects.analytics.track('Comments - Create Comment', {
    type: (comment.anchorReference && comment.anchorReference.type) || 'global',
  });

  // The server might be ahead on sandbox version, so we need to try to save
  // several times
  let tryCount = 0;

  async function trySaveComment() {
    tryCount++;

    const {
      userReferences,
      codeReferences,
      imageReferences,
    } = comment.references.reduce<{
      userReferences: UserReference[];
      codeReferences: CodeReference[];
      imageReferences: ImageReference[];
    }>(
      (aggr, reference) => {
        if (reference.type === 'user') {
          aggr.userReferences.push({
            userId: (reference.metadata as UserReferenceMetadata).userId,
            username: (reference.metadata as UserReferenceMetadata).username,
          });
        } else if (reference.type === 'code') {
          aggr.codeReferences.push({
            anchor: (reference.metadata as CodeReferenceMetadata).anchor,
            code: (reference.metadata as CodeReferenceMetadata).code,
            head: (reference.metadata as CodeReferenceMetadata).head,
            path: (reference.metadata as CodeReferenceMetadata).path,
            lastUpdatedAt: state.editor.currentSandbox!.modules.find(
              module =>
                module.path ===
                (reference.metadata as CodeReferenceMetadata).path
            )!.updatedAt,
          });
        } else if (reference.type === 'image') {
          aggr.imageReferences.push({
            fileName: (reference.metadata as ImageReferenceMetadata).fileName,
            resolution: (reference.metadata as ImageReferenceMetadata)
              .resolution,
            src: (reference.metadata as ImageReferenceMetadata).url,
            url: '', // Backend typing issue, need the url here
          });
        }
        return aggr;
      },
      {
        userReferences: [],
        codeReferences: [],
        imageReferences: [],
      }
    );
    const baseCommentPayload = {
      id: comment.id,
      parentCommentId: comment.parentComment ? comment.parentComment.id : null,
      sandboxId: sandbox.id,
      content: comment.content || '',
      userReferences,
      codeReferences,
      imageReferences,
    };

    if (comment.anchorReference) {
      const reference = comment.anchorReference;

      if (reference.type === 'code') {
        const metadata = reference.metadata as CodeReferenceMetadata;
        await effects.gql.mutations.createCodeComment({
          ...baseCommentPayload,
          anchorReference: {
            anchor: metadata.anchor,
            head: metadata.head,
            code: metadata.code,
            path: metadata.path,
            lastUpdatedAt: state.editor.currentSandbox!.modules.find(
              module => module.path === metadata.path
            )!.updatedAt,
          },
        });
      } else if (reference.type === 'preview') {
        const isResponsive = state.preview.mode === 'responsive-add-comment';
        const metadata = reference.metadata as PreviewReferenceMetadata;
        await effects.gql.mutations.createPreviewComment({
          ...baseCommentPayload,
          anchorReference: {
            responsive: isResponsive,
            height: Math.round(metadata.height),
            previewPath: metadata.previewPath,
            userAgent: metadata.userAgent,
            screenshotSrc: metadata.screenshotUrl || null,
            width: Math.round(metadata.width),
            x: Math.round(metadata.x),
            y: Math.round(metadata.y),
          },
        });
      }
    } else {
      await effects.gql.mutations.createComment(baseCommentPayload);
    }
  }

  try {
    await trySaveComment();
  } catch (error) {
    if (error.response?.data?.error === 'old_version' && tryCount < 3) {
      await trySaveComment();
    } else {
      captureException(error);
      effects.notificationToast.error(
        'Unable to create your comment, please try again'
      );

      if (comment.parentComment) {
        comments[sandbox.id][comment.parentComment.id].replyCount--;
      }

      delete comments[sandbox.id][comment.id];
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

  effects.analytics.track('Comments - Delete Comment');

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

  effects.analytics.track('Comments - Resolve Comment');

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
  effects.analytics.track('Comments - Copy Permalink');
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
      `There was a problem getting the sandbox comments`
    );
  }

  // When we load the comments there might be changes already, lets make sure we transpose
  // any comments on these changes. This does not fix it if you already managed to save, but
  // that is considered an extreme edge case
  state.editor.changedModuleShortids.forEach(moduleShortid => {
    const module = state.editor.currentSandbox!.modules.find(
      moduleItem => moduleItem.shortid === moduleShortid
    );

    if (!module) {
      return;
    }

    const operation = getTextOperation(module.savedCode || '', module.code);
    actions.comments.transposeComments({ module, operation });
  });
};

export const onCommentAdded: Action<CommentAddedSubscription> = (
  { state },
  { commentAdded: comment }
) => {
  if (comment.anchorReference && comment.anchorReference.type === 'code') {
    const metadata = comment.anchorReference
      .metadata as CodeReferenceMetadataFragment;
    const sandbox = state.editor.currentSandbox;
    if (!sandbox) {
      return;
    }

    const module = sandbox.modules.find(
      moduleItem => moduleItem.path === metadata.path
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
    const range = new Selection.Range(metadata.anchor, metadata.head);
    const newRange = range.transform(diffOperation);

    metadata.anchor = newRange.anchor;
    metadata.head = newRange.head;
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

export const transposeComments: Action<{
  module: Module;
  operation: TextOperation;
}> = ({ state }, { module, operation }) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  const comments = state.comments.fileComments[module.path] || [];
  comments.forEach(fileComment => {
    const range = new Selection.Range(...fileComment.range);
    const newRange = range.transform(operation);
    const comment = state.comments.comments[sandbox.id][fileComment.commentId];
    if (comment.anchorReference && comment.anchorReference.type === 'code') {
      const metadata = comment.anchorReference
        .metadata as CodeReferenceMetadataFragment;
      metadata.anchor = newRange.anchor;
      metadata.head = newRange.head;
    }
  });
};
