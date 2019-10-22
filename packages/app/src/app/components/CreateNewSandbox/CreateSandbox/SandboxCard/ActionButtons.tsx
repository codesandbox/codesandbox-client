import React from 'react';
import { client } from 'app/graphql/client';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ActionButton } from './elements';
// @ts-ignore
import { bookmarkTemplate, unbookmarkTemplate } from './mutations.gql';
// @ts-ignore
import { isBookmarked } from './queries.gql';

interface IActionButtons {
  sandboxID: string;
  id: string;
}

export const ActionButtons = ({ sandboxID, id }: IActionButtons) => {
  const { data, loading, error } = useQuery(isBookmarked, {
    variables: { id: sandboxID },
  });
  const config = {
    variables: {
      template: id,
    },
    update: () => client.resetStore(),
  };
  const [follow] = useMutation<any, any>(bookmarkTemplate, config);
  const [unfollow] = useMutation<any, any>(unbookmarkTemplate, config);

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
