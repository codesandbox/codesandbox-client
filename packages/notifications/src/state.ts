import * as uuid from 'uuid';

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

export class NotificationState {
  notifications: Map<string, NotificationMessage>;

  public addNotification(notification: NotificationMessage): string {
    const id = notification.id || uuid.v4();
    this.notifications[id] = notification;

    return id;
  }

  public updateNotification(id: string, options: NotificationMessage) {
    this.notifications[id] = options;
  }
}
