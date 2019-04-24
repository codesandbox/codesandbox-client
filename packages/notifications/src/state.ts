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
  message: string;
  actions?: NotificationAction[];
  timeAlive?: number;
  status: NotificationStatus;
}

export enum NotificationChange {
  ADD,
  CHANGE,
  REMOVE,
}

export interface NotificationEvent {
  type: NotificationChange;
  id: string;
  notification: NotificationMessage;
}

export class NotificationState {
  private _onNotificationAdded = new Emitter<NotificationEvent>();

  notifications: Map<string, NotificationMessage> = new Map();
  onNotificationAdded = this._onNotificationAdded.event;

  public addNotification(notification: NotificationMessage): string {
    const id = notification.id || uuid.v4();
    this.notifications.set(id, notification);

    this._onNotificationAdded.emit({
      type: NotificationChange.ADD,
      id,
      notification,
    });

    return id;
  }

  public updateNotification(id: string, notification: NotificationMessage) {
    this.notifications.set(id, notification);

    this._onNotificationAdded.emit({
      type: NotificationChange.CHANGE,
      id,
      notification,
    });
  }

  public removeNotification(id: string) {
    if (this.notifications.has(id)) {
      this.notifications.delete(id);

      this._onNotificationAdded.emit({
        type: NotificationChange.REMOVE,
        id,
      });
    }
  }
}
