import { Action } from './';

export interface NotificationAction extends Action {
  title: string;
  notificationType: 'notice' | 'warning' | 'error' | 'success';
  timeAlive: number;
}

/**
 * Returns an action that describes to open a notification in the editor
 *
 * @export
 * @param {string} title
 * @param {('notice' | 'warning' | 'error' | 'success')} [notificationType='notice']
 * @param {number} [timeAlive=2] How long the notification should show in seconds
 * @returns {NotificationAction}
 */
export function show(
  title: string,
  notificationType: 'notice' | 'warning' | 'error' | 'success' = 'notice',
  timeAlive: number = 2
): NotificationAction {
  // TODO automatically add type: 'action', maybe do this after conversion to TS
  return {
    type: 'action',
    action: 'notification',
    title,
    notificationType,
    timeAlive,
  };
}
