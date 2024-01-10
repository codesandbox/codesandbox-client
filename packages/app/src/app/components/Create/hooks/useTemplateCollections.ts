import { useEffect, useState } from 'react';
import { TemplateCollection } from '../utils/types';
import { getTemplateInfosFromAPI } from '../utils/api';

type TemplateCollectionsState =
  | {
      state: 'idle';
      collections: TemplateCollection[];
    }
  | {
      state: 'loading';
      collections: TemplateCollection[];
    }
  | {
      state: 'success';
      collections: TemplateCollection[];
    }
  | {
      state: 'error';
      error: string;
      collections: TemplateCollection[];
    };

export const useTemplateCollections = ({
  type,
}: {
  type: 'devbox' | 'sandbox';
}) => {
  const [collectionsState, setCollectionsState] = useState<
    TemplateCollectionsState
  >({
    state: type === 'devbox' ? 'loading' : 'idle',
    collections: [],
  });

  useEffect(() => {
    if (collectionsState.state === 'idle' && type === 'devbox') {
      setCollectionsState({ state: 'loading', collections: [] });
    }
  }, [collectionsState.state, type]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getTemplateInfosFromAPI(
          '/api/v1/sandboxes/templates/explore'
        );

        setCollectionsState({
          state: 'success',
          collections: result,
        });
      } catch {
        setCollectionsState({
          state: 'error',
          error: 'Something went wrong when fetching more templates, sorry!',
          collections: [],
        });
      }
    }

    if (collectionsState.state === 'loading') {
      fetchData();
    }
  }, [collectionsState.state]);

  return collectionsState;
};
