import callApi from '../../services/api';
import delay from '../../services/delay';

export default function fetch(actions, id: string) {
  return async (dispatch: Function) => {
    dispatch({ type: actions.REQUEST, initial: true, id });
    const firstResult = await callApi('/bundler/bundle', {
      method: 'POST',
      body: { id },
    });
    dispatch({ type: actions.SUCCESS, result: firstResult });

    if (firstResult.manifest) {
      return firstResult;
    }

    while (true) {
      await delay(1000);
      const result = await callApi(`/bundler/bundle/${firstResult.hash}`);

      if (result.manifest) {
        return result;
      }
    }
  };
}
