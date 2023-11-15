import { TemplateFragment } from 'app/graphql/types';
import { useEffect, useState } from 'react';
import { getTemplateInfosFromAPI } from '../utils/api';

type State =
  | {
      state: 'loading';
    }
  | {
      state: 'ready';
      templates: TemplateFragment[];
    }
  | {
      state: 'error';
      error: string;
    };

export const useOfficialTemplates = (): State => {
  const [officialTemplates, setOfficialTemplates] = useState<State>({
    state: 'loading',
  });

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await getTemplateInfosFromAPI(
          '/api/v1/sandboxes/templates/official'
        );

        setOfficialTemplates({
          state: 'ready',
          templates: response[0].templates,
        });
      } catch {
        setOfficialTemplates({
          state: 'error',
          error: 'Something went wrong when fetching more templates, sorry!',
        });
      }
    }

    if (officialTemplates.state === 'loading') {
      fetchTemplates();
    }
  }, [officialTemplates.state]);

  return officialTemplates;
};
