export type Message = {
  id: string;
  content?: string;
  author?: Author;
};

export type Author = {
  avatarUrl: string;
  username: string;
};

export type Comment = {
  id: string;
  isResolved: boolean;
  originalMessage: Message;
  replies: Message[];
  insertedAt: string;
  updatedAt: string;
};

export type CommentsVariables = {
  sandboxId: string;
};

export type CommentsResponse = {
  comments: [
    {
      id: string;
      isResolved: boolean;
      replies: Pick<Message, 'id'>[];
      originalMessage: Message;
      insertedAt: string;
      updatedAt: string;
    }
  ];
};

export type AddCommentVariables = {
  sandboxId: string;
  comment: string;
  username: string;
};

export type AddCommentResponse = {
  addComment: {
    id: string;
    originalMessage: Message;
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
      content: string;
    };
    replies: Message[];
    insertedAt: string;
    updatedAt: string;
  };
};
