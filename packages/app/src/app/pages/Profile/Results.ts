import { connectHits } from 'react-instantsearch-dom';
import { AlgoliaSandboxHit, SmallSandbox } from '@codesandbox/common/lib/types';

export const toSmallSandbox = (hits: AlgoliaSandboxHit[]): SmallSandbox[] =>
  hits.map((hit: AlgoliaSandboxHit) => ({
    id: hit.objectID,
    alias: hit.alias,
    title: hit.title,
    description: hit.description,
    privacy: 0,
    template: hit.template,
    likeCount: hit.like_count,
    viewCount: hit.view_count,
    forkCount: hit.fork_count,
    insertedAt: hit.inserted_at,
    updatedAt: hit.updated_at,
    customTemplate: null,
    git: null,
  }));

export const Results = connectHits(({ hits, children }) => {
  const results = toSmallSandbox(hits);
  // @ts-ignore
  return children({ results });
});
