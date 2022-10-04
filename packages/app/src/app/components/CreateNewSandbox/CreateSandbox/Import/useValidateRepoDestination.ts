import { debounce } from 'lodash-es';
import React from 'react';
import { validateRepositoryDestination } from '../utils/api';

export type State =
  | { state: 'idle' }
  | { state: 'validating' }
  | {
      state: 'valid';
    }
  | {
      state: 'invalid';
      error: string;
    };

type ValidateRepoDestination = (owner: string, name: string) => State;

export const useValidateRepoDestination: ValidateRepoDestination = (
  owner,
  name
) => {
  const [state, setState] = React.useState<State>({ state: 'idle' });

  const validate = React.useCallback(async (destination: string) => {
    if (!destination) {
      setState({ state: 'idle' });
      return;
    }

    setState({ state: 'validating' });
    try {
      const res = await validateRepositoryDestination(destination);
      if (!res.valid) {
        throw Error(res.message ?? 'Invalid repository name or organization');
      }
      setState({ state: 'valid' });
    } catch (error) {
      setState({ state: 'invalid', error: error.message });
    }
  }, []);

  const debouncedValidate = React.useCallback(debounce(validate, 500), []);

  React.useEffect(() => {
    const destination = owner && name ? `${owner}/${name}` : null;
    debouncedValidate(destination);
  }, [owner, name]);

  return state;
};
