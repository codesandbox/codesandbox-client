import { TemplateFragment } from 'app/graphql/types';
import { useEffect, useState } from 'react';
import { getTemplateInfosFromAPI } from '../utils/api';

type State =
  | {
      state: 'loading';
      templates: TemplateFragment[];
    }
  | {
      state: 'ready';
      templates: TemplateFragment[];
    }
  | {
      state: 'error';
      templates: TemplateFragment[];
      error: string;
    };

export const useOfficialTemplates = ({
  type,
}: {
  type: 'devbox' | 'sandbox';
}): State => {
  const [officialTemplates, setOfficialTemplates] = useState<State>({
    state: 'loading',
    templates: [],
  });

  const noDevboxesWhenListingSandboxes = (t: TemplateFragment) =>
    type === 'sandbox' ? !t.sandbox.isV2 : true;

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await getTemplateInfosFromAPI(
          '/api/v1/sandboxes/templates/official'
        );

        setOfficialTemplates({
          state: 'ready',
          templates: response[0].templates.filter(
            noDevboxesWhenListingSandboxes
          ),
        });
      } catch {
        setOfficialTemplates({
          state: 'error',
          templates: [],
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
