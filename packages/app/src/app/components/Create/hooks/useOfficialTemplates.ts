import { TemplateFragment } from 'app/graphql/types';
import {  useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
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
    };

export const useOfficialTemplates = ({
  type,
}: {
  type: 'devbox' | 'sandbox';
}): State => {
  const { officialTemplates } = useAppState();

  const [officialTemplatesData, setOfficialTemplatesData] = useState<State>({
    state: officialTemplates.length > 0 ? 'ready' : 'loading',
    templates: officialTemplates,
  });

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await getTemplateInfosFromAPI(
          '/api/v1/sandboxes/templates/official'
        );

        setOfficialTemplatesData({
          state: 'ready',
          templates: response[0].templates,
        });
      } catch {
        setOfficialTemplatesData({
          state: 'error',
          templates: [],
        });
      }
    }

    if (officialTemplatesData.state === 'loading') {
      fetchTemplates();
    }
  }, [officialTemplatesData.state]);

  return {
    state: officialTemplatesData.state,
    templates: officialTemplatesData.templates.filter(t =>
      type === 'sandbox' && !t.sandbox.isV2 || type === 'devbox' && t.sandbox.isV2
    ),
  };
};
