/* eslint no-shadow: 0 */

export const addNotification = (
  title,
  notificationType,
  timeAlive = 2,
  buttons = []
) =>
  function addNotification({ state }) {
    const now = Date.now();

    state.push('notifications', {
      id: now,
      title,
      notificationType,
      buttons,
      endTime: now + timeAlive * 1000,
    });
  };
