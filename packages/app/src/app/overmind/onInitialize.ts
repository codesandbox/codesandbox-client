import { OnInitialize } from '.';

export const onInitialize: OnInitialize = ({ state, effects, actions }) => {
  const provideJwtToken = () => {
    return state.jwt || effects.jwt.get();
  };

  effects.socket.initialize({
    provideJwtToken,
  });

  effects.api.initialize({
    provideJwtToken,
    onError(error) {
      /*
      TODO: This needs to be handled differently!
    controller.runSignal(
      'showNotification',
      addNotification(errorMessage, 'error')
    );
    */
    },
  });

  effects.notifications.initialize({
    provideSocket() {
      return effects.socket.getSocket();
    },
  });
};
