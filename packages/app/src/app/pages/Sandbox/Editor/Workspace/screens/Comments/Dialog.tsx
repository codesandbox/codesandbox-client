import React from 'react';
import ReactDOM from 'react-dom';
import css from '@styled-system/css';
import Draggable from 'react-draggable';
import {
  Element,
  Stack,
  Avatar,
  Button,
  Textarea,
  Text,
  IconButton,
} from '@codesandbox/components';

export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

export const Dialog = props => {
  const [position, setPosition] = React.useState({
    x: 200,
    y: 100,
  });

  const closeDialog = () => {};
  const onSubmit = () => {};

  const onDragStop = (event, data) => {
    setPosition({
      x: data.x,
      y: data.y,
    });
  };

  return (
    <Draggable handle=".handle" position={position} onStop={onDragStop}>
      <Element
        css={css({
          position: 'absolute',
          zIndex: 2,
          backgroundColor: 'dialog.background',
          color: 'dialog.foreground',
          border: '1px solid',
          borderColor: 'dialog.border',
          borderRadius: 4,
          width: 420,
          height: 'auto',
          paddingBottom: 4,
        })}
      >
        <Stack direction="vertical">
          <Stack
            className="handle"
            justify="space-between"
            padding={2}
            paddingLeft={4}
            css={{ cursor: 'move' }}
          >
            <Stack align="center" gap={2}>
              <Avatar
                user={{ avatarUrl: 'https://github.com/DannyRuchtie.png' }}
              />
              <Text size={3}>Danny Rutchie</Text>
            </Stack>

            <Stack align="center">
              <IconButton
                name="cross"
                size={3}
                title="Close comment dialog"
                onClick={closeDialog}
              />
            </Stack>
          </Stack>

          <Textarea
            autosize
            css={css({ minHeight: 8, overflow: 'hidden' })}
            placeholder="Write a comment..."
            onKeyDown={event => {
              if (event.key === 'Enter') onSubmit(event);
            }}
          />
        </Stack>
      </Element>
    </Draggable>
  );
};
