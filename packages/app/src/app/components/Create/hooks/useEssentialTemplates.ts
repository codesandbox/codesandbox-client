import { useEffect, useState } from 'react';
import { TemplateInfo } from '../utils/types';
import { getTemplateInfosFromAPI } from '../utils/api';

type EssentialsState =
  | {
      state: 'loading';
    }
  | {
      state: 'success';
      essentials: TemplateInfo[];
    }
  | {
      state: 'error';
      error: string;
    };

export const useEssentialTemplates = (showEssentialTemplates: boolean) => {
  const [essentialState, setEssentialState] = useState<EssentialsState>({
    state: 'loading',
  });

  useEffect(() => {
    if (!showEssentialTemplates) {
      return;
    }

    async function getEssentials() {
      try {
        const result = await getTemplateInfosFromAPI(
          '/api/v1/sandboxes/templates/explore'
        );

        setEssentialState({
          state: 'success',
          essentials: result,
        });
      } catch {
        setEssentialState({
          state: 'error',
          error: 'Something went wrong when fetching more templates, sorry!',
        });
      }
    }

    if (essentialState.state === 'loading') {
      getEssentials();
    }
  }, [essentialState.state]);

  return essentialState;
};
