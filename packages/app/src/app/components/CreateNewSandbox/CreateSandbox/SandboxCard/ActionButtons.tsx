import React from 'react';
import { client } from 'app/graphql/client';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  BookmarkTemplateFromCardMutation,
  BookmarkTemplateFromCardMutationVariables,
  UnbookmarkTemplateFromCardMutation,
  UnbookmarkTemplateFromCardMutationVariables,
  IsBookmarkedQuery,
} from 'app/graphql/types';
import { ActionButton } from './elements';
import {
  bookmarkTemplateFromCard,
  unbookmarkTemplateFromCard,
} from './mutations.gql';
// @ts-ignore
import { isBookmarked } from './queries.gql';

interface IActionButtons {
  sandboxID: string;
  id: string;
}

export const ActionButtons = ({ sandboxID, id }: IActionButtons) => {
  const { data, loading, error } = useQuery<IsBookmarkedQuery>(isBookmarked, {
    variables: { id: sandboxID },
  });
  const config = {
    variables: {
      template: id,
    },
    update: () => client.resetStore(),
  };
  const [follow] = useMutation<
    BookmarkTemplateFromCardMutation,
    BookmarkTemplateFromCardMutationVariables
  >(bookmarkTemplateFromCard, config);
  const [unfollow] = useMutation<
    UnbookmarkTemplateFromCardMutation,
    UnbookmarkTemplateFromCardMutationVariables
  >(unbookmarkTemplateFromCard, config);

  if (loading || error || !data.sandbox) return null;
  const userBookmarked = data.sandbox.customTemplate.bookmarked.find(
    b => b.entity.__typename === 'User'
  );

  return userBookmarked.isBookmarked ? (
    <ActionButton onClick={() => unfollow()}>Remove</ActionButton>
  ) : (
    <ActionButton onClick={() => follow()}>+ Bookmark</ActionButton>
  );
};
