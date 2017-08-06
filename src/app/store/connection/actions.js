import addListener from 'common/connection-manager';

export const SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS';

const createConnectionAction = connected => ({
  type: SET_CONNECTION_STATUS,
  connected,
});

const initializeConnectionListener = () => dispatch => {
  const listener = (connected: boolean) => {
    dispatch(createConnectionAction(connected));
  };

  const unlisten = addListener(listener);
  return unlisten;
};

export default initializeConnectionListener;
