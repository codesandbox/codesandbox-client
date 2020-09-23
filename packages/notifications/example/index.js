import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ThemeProvider, Stack } from '@codesandbox/components';
import { Toasts, NotificationState, NotificationStatus } from '../lib';

const state = new NotificationState();

state.addNotification({
  sticky: true,
  title: 'Forked Sandbox',
  // message: 'This is one of our notifications',
  status: NotificationStatus.SUCCESS,
});
state.addNotification({
  sticky: true,
  title: 'Test Notification 2',
  message: 'This is one of our notifications',
  status: NotificationStatus.WARNING,
});
state.addNotification({
  sticky: true,
  title: 'Test Notification 3',
  message: 'This is one of our notifications',
  actions: {
    primary: {
      run: () => alert('hello!'),
      label: 'Run My Command!!',
    },
  },
  status: NotificationStatus.SUCCESS,
});
state.addNotification({
  sticky: true,
  title: 'Test Notification 4',
  message: 'This is one of our notifications',
  status: NotificationStatus.ERROR,
  actions: [
    {
      primary: {
        run: () => alert('hello!'),
        label: 'Run My Command!!',
      },
      secondary: {
        run: () => alert('bye!'),
        label: 'Bye',
      },
    },
  ],
});

function App() {
  return (
    <ThemeProvider>
      <Stack
        gap={4}
        className="App"
        style={{
          flexWrap: 'wrap',
          width: '100vw',
        }}
        padding={10}
      >
        <Button
          autoWidth
          type="button"
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.SUCCESS,
            });
          }}
        >
          Add Success Notification
        </Button>
        <Button
          autoWidth
          type="button"
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.ERROR,
            });
          }}
        >
          Add Error Notification
        </Button>
        <Button
          autoWidth
          type="button"
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.NOTICE,
            });
          }}
        >
          Add Notice Notification
        </Button>
        <Button
          autoWidth
          type="button"
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.WARNING,
            });
          }}
        >
          Add Warning Notification
        </Button>
        <Button
          type="button"
          autoWidth
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              title: 'Changes synced from Master',
              message:
                'We have synced over the changes made in master. View the changes on Github',
              status: NotificationStatus.NOTICE,
            });
          }}
        >
          Add Notification with Title and Message
        </Button>
        <Button
          type="button"
          autoWidth
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.WARNING,
              actions: {
                primary: {
                  run: () => alert('hello!'),
                  label: 'primary',
                },
              },
            });
          }}
        >
          Add Notification with one button
        </Button>
        <Button
          autoWidth
          type="button"
          style={{ marginBottom: 16 }}
          onClick={() => {
            state.addNotification({
              message: 'New notification!',
              status: NotificationStatus.WARNING,
              actions: {
                primary: {
                  run: () => alert('hello!'),
                  label: 'primary',
                },
                secondary: {
                  run: () => alert('hello!'),
                  label: 'secondary',
                },
              },
            });
          }}
        >
          Add Notification with two buttons
        </Button>
        <Toasts state={state} />
      </Stack>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
