import * as internalActions from './internalActions';
import { Action } from 'app/overmind';

export const internal = internalActions;

export const codeChanged: Action<{ code: string; moduleShortid: string }> = (
  { state },
  { code, moduleShortid }
) => {};
