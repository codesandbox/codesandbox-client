// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';
import entity from './entity';
import { sandboxUrl } from '../../../utils/url-generator';

const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');

export default {
  getById: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(SINGLE_SANDBOX_API_ACTIONS, `sandboxes/${id}`),
    );

    dispatch(normalizeResult(entity, data));
  },
  createSandbox: () => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(CREATE_SANDBOX_API_ACTIONS, `sandboxes`, {
        method: 'POST',
        body: { sandbox: {} },
      }),
    );

    await dispatch(normalizeResult(entity, data));

    return sandboxUrl(data);
  },
  forkSandbox: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
        method: 'POST',
      }),
    );

    await dispatch(normalizeResult(entity, data));

    return sandboxUrl(data);
  },
};
