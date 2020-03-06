export type Message = {
  id: string;
  content?: string;
  author?: Author;
};

export type Reply = {
  id: string;
  content?: string;
  author?: Author;
  insertedAt?: string;
  updatedAt?: string;
};

export type Author = {
  id: string;
  avatarUrl: string;
  username: string;
};

export type Comment = {
  id: string;
  isResolved: boolean;
  originalMessage: Message;
  replies: Reply[];
  insertedAt: string;
  updatedAt?: string;
  metadata?: string;
};

export type CommentsVariables = {
  sandboxId: string;
};

export type CommentsResponse = {
  comments: [
    {
      id: string;
      isResolved: boolean;
      replies: Pick<Reply, 'id'>[];
      originalMessage: Message;
      insertedAt: string;
      updatedAt: string;
      metadata: string;
    }
  ];
};

export type AddCommentVariables = {
  sandboxId: string;
  comment: string;
  username: string;
  metadata?: string;
};

export type AddCommentResponse = {
  addComment: {
    id: string;
    isResolved: boolean;
    replies: Pick<Reply, 'id'>[];
    originalMessage: Message;
    insertedAt: string;
    updatedAt: string;
    metadata: string;
  };
};

export type DeleteCommentVariables = {
  id: string;
};

export type DeleteCommentResponse = {
  deleteComment: {
    id: string;
  };
};

export type UpdateCommentVariables = {
  id: string;
  comment?: string;
  isResolved?: boolean;
  metadata?: string;
};

export type UpdateCommentResponse = {
  updateComment: {
    id: string;
    isResolved: string;
    originalMessage: {
      id: string;
      content: string;
    };
  };
};

export type CommentVariables = {
  sandboxId: string;
  id: string;
};

export type CommentResponse = {
  comment: {
    id: string;
    isResolved: boolean;
    originalMessage: {
      id: string;
      content: string;
    };
    replies: Reply[];
    insertedAt: string;
    updatedAt: string;
    metadata: string;
  };
};

export type DeleteReplyVariables = { replyId: string; commentId: string };

export type DeleteReplyResponse = {
  deleteReply: {
    id: string;
    replies: Reply[];
  };
};

export type UpdateReplyVariables = {
  replyId: string;
  commentId: string;
  comment: string;
};

export type UpdateReplyResponse = {
  updateReply: {
    id: string;
    replies: Reply[];
  };
};
