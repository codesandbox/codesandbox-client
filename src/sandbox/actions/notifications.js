export function showNotification(
  title: string,
  notificationType: 'notice' | 'warning' | 'error' | 'success' = 'notice',
  timeAlive: number = 2,
) {
  // TODO automatically add type: 'action', maybe do this after conversion to TS
  return {
    type: 'action',
    action: 'notification',
    title,
    notificationType,
    timeAlive,
  };
}
