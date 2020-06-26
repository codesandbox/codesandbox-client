import { UserQuery } from '@codesandbox/common/lib/types';
import { Reference, UserReferenceMetadata } from 'app/graphql/types';

export function convertMentionsToMentionLinks(
  value: string,
  mentions: { [mentionName: string]: UserQuery }
) {
  const words = value.split(' ');

  return words
    .reduce<string[]>((aggr, word) => {
      if (word[0] === '@' && word.substr(1) in mentions) {
        return aggr.concat(`[${word}](user://${mentions[word.substr(1)].id})`);
      }

      return aggr.concat(word);
    }, [])
    .join(' ');
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
      id: null,
      type: 'user',
      resource: `user://${userQuery.id}`,
      metadata: {
        userId: userQuery.id,
        username: userQuery.username,
      },
    });
  }, []);
}
