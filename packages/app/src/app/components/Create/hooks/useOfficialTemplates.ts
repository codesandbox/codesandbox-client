import { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import { getTemplateInfosFromAPI } from '../utils/api';
import { SandboxToFork } from '../utils/types';

type State =
  | {
      state: 'loading';
      templates: SandboxToFork[];
    }
  | {
      state: 'ready';
      templates: SandboxToFork[];
    }
  | {
      state: 'error';
      templates: SandboxToFork[];
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
    templates: officialTemplatesData.templates.filter(
      t => (type === 'sandbox' && !t.isV2) || (type === 'devbox' && t.isV2)
    ),
  };
};
