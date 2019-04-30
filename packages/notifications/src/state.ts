import * as uuid from 'uuid';
import { Emitter } from './utils/events';

export interface NotificationAction {
  title: string;
  run: () => void;
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
    primary: NotificationAction;
    secondary?: NotificationAction;
  }[];
  timeAlive?: number;
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
