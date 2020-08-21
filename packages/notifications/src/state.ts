import * as uuid from 'uuid';
import { Emitter } from './utils/events';

export interface NotificationAction {
  label: string;
  run: (event?: any) => void;
  hideOnClick?: boolean;
}

export enum NotificationStatus {
  NOTICE,
  SUCCESS,
  WARNING,
  ERROR,
}

export interface NotificationMessage {
  id?: string;
  title?: string;
  sticky?: boolean;
  message: string;
  actions?: {
    /**
     * Primary actions show up as buttons as part of the message and will close
     * the notification once clicked.
     */
    primary?: NotificationAction;
    /**
     * Secondary actions are meant to provide additional configuration or context
     * for the notification and will show up less prominent. A notification does not
     * close automatically when invoking a secondary action.
     */
    secondary?: NotificationAction;
  };
  timeAlive?: number;
  onHide?: () => void;
  status: NotificationStatus;
}

export enum NotificationChange {
  ADD,
  CHANGE,
}

export interface NotificationUpdatedEvent {
  type: NotificationChange;
  id: string;
  notification: NotificationMessage;
}

export interface NotificationRemovedEvent {
  id: string;
}

export class NotificationState {
  private readonly _onNotificationUpdated = new Emitter<
    NotificationUpdatedEvent
  >();

  private readonly _onNotificationRemoved = new Emitter<
    NotificationRemovedEvent
  >();

  onNotificationUpdated = this._onNotificationUpdated.event;
  onNotificationRemoved = this._onNotificationRemoved.event;

  notifications: Map<string, NotificationMessage> = new Map();

  public getNotifications() {
    return this.notifications;
  }

  public addNotification(notification: NotificationMessage): string {
    const id = notification.id || uuid.v4();
    this.notifications.set(id, notification);

    this._onNotificationUpdated.emit({
      type: NotificationChange.ADD,
      id,
      notification,
    });

    return id;
  }

  public updateNotification(id: string, notification: NotificationMessage) {
    this.notifications.set(id, notification);

    this._onNotificationUpdated.emit({
      type: NotificationChange.CHANGE,
      id,
      notification,
    });
  }

  public removeNotification(id: string) {
    if (this.notifications.has(id)) {
      this.notifications.delete(id);

      this._onNotificationRemoved.emit({
        id,
      });
    }
  }
}
