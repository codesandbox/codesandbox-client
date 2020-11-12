import { UserQuery } from '@codesandbox/common/lib/types';
import {
  CommentFragment,
  Reference,
  UserReferenceMetadata,
} from 'app/graphql/types';

export function convertMentionsToMentionLinks(
  value: string,
  mentions: { [mentionName: string]: UserQuery }
) {
  return Object.keys(mentions).reduce(
    (aggr, username) =>
      aggr.replace(
        new RegExp('@' + username, 'ig'),
        `[@${username}](user://${mentions[username].id})`
      ),
    value
  );
}

export function convertMentionLinksToMentions(value = '') {
  const words = value.split(' ');

  return words
    .reduce<string[]>((aggr, word) => {
      const match = word.match(/\[(.*)\]\(user:\/\/.*\)/);

      if (match) {
        return aggr.concat(match[1]);
      }

      return aggr.concat(word);
    }, [])
    .join(' ');
}

export function convertMentionsToUserReferences(mentions: {
  [username: string]: UserQuery;
}) {
  return Object.keys(mentions).reduce<
    (Reference & { metadata: UserReferenceMetadata })[]
  >((aggr, key) => {
    const userQuery = mentions[key];
    return aggr.concat({
      id: '',
      type: 'user',
      resource: `user://${userQuery.id}`,
      metadata: {
        userId: userQuery.id,
        username: userQuery.username,
      },
    });
  }, []);
}

export function convertUserReferencesToMentions(
  userReferences: CommentFragment['references']
) {
  return userReferences.reduce<{
    [username: string]: UserQuery;
  }>((aggr, reference) => {
    if (reference.type === 'user') {
      const metadata = reference.metadata as UserReferenceMetadata;
      aggr[metadata.username] = {
        id: metadata.userId,
        username: metadata.username,
        avatarUrl: '',
      };
    }

    return aggr;
  }, {});
}
