import { UserQuery } from '@codesandbox/common/lib/types';
import {
  CommentFragment,
  Reference,
  UserReferenceMetadata,
  ImageReferenceMetadata,
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

export function convertImagesToImageReferences(images: {
  [fileName: string]: { src: string; resolution: [number, number] };
}) {
  return Object.keys(images).reduce<
    (Reference & { metadata: ImageReferenceMetadata })[]
  >((aggr, key) => {
    const image = images[key];
    return aggr.concat({
      id: '',
      type: 'image',
      resource: '',
      metadata: {
        fileName: key,
        resolution: image.resolution,
        uploadId: 0,
        url: image.src,
      },
    });
  }, []);
}

export function convertImageReferencesToMarkdownImages(
  value: string,
  imageReferences: CommentFragment['references']
) {
  return imageReferences.reduce<string>((aggr, reference) => {
    if (reference.type === 'image') {
      const metadata = reference.metadata as ImageReferenceMetadata;

      return aggr.replace(
        // We do not check the full ![](FILE_NAME) signature, only (FILE_NAME)
        // as this is more than enough
        new RegExp('\\(' + metadata.fileName + '\\)', 'ig'),
        `(${reference.resource})`
      );
    }

    return aggr;
  }, value);
}
