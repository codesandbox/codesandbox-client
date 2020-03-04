import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import css from '@styled-system/css';
import Draggable from 'react-draggable';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

import {
  Element,
  Stack,
  Avatar,
  Textarea,
  Text,
  IconButton,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Comment } from './Comment';

// // eslint-disable-next-line no-var
// var markdown = `
// I am a comment

// Here's that code block:

// \`\`\`js
// const total = [1, 2, 3, 4, 5]
//   .map(num => num * 3)
//   .filter(num => num < 9)
//   .reduce((sum, num) => sum += num, 0)

// \`\`\`

// Neat, eh?`;

// const defaultComment = {
//   id: '5e59204cc277a40fef1e3916',
//   isResolved: false,
//   originalMessage: {
//     id: 'gier2bk769d03r',
//     content: markdown,
//     author: {
//       id: '740dca51-993d-4b0e-b8cb-0e46acada86b',
//       avatarUrl: 'https://avatars0.githubusercontent.com/u/1863771?v=4',
//       username: 'siddharthkp',
//     },
//   },
//   replies: [
//     {
//       id: 'a\n-SaraVieira',
//       content: 'A reply',
//       author: {
//         avatarUrl: 'https://avatars0.githubusercontent.com/u/1051509?v=4',
//         badges: [{ id: 'patron_2', name: 'Patron II', visible: true }],
//         curatorAt: '2018-11-25T18:51:34Z',
//         email: 'hey@iamsaravieira.com',
//         experiments: { containerLsp: null },
//         id: '8d35d7c1-eecb-4aad-87b0-c22d30d12081',
//         integrations: {
//           github: null,
//           zeit: { token: 'pqshnGwa4t3y7RxMzfHnoSW1' },
//         },
//         name: 'Sara Vieira',
//         sendSurvey: false,
//         subscription: {
//           amount: 10,
//           cancelAtPeriodEnd: false,
//           duration: 'monthly',
//           plan: 'patron',
//           since: '2018-03-01T16:00:18Z',
//         },
//         username: 'SaraVieira',
//       },
//     },
//   ],
//   insertedAt: '2020-02-28T14:14:36.859Z',
//   updatedAt: '2020-02-28T14:14:36.859Z',
// };
export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

export const Dialog = props => {
  const { state, actions } = useOvermind();
  const [value, setValue] = useState('');
  const comment = state.editor.currentComment;
  const [position, setPosition] = React.useState({
    x: 200,
    y: 100,
  });

  const closeDialog = () => actions.editor.selectComment(null);
  const onSubmit = () => {
    setValue('');
    if (comment) {
      actions.editor.addReply(value);
    } else {
      actions.editor.addComment({
        comment: value,
        sandboxId: state.editor.currentSandbox.id,
        username: state.user.username,
        open: true,
      });
    }
  };

  const onDragStop = (_, data) => {
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
            marginBottom={4}
          >
            <Stack align="center" gap={2}>
              <Avatar user={comment.originalMessage.author} />
              <Text size={3}>{comment.originalMessage.author.username}</Text>
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
          {comment && (
            <>
              <Comment source={comment.originalMessage.content} />
              {comment.replies.map(c => (
                <>
                  <Element
                    paddingX={4}
                    paddingTop={6}
                    css={css({
                      borderTop: '1px solid',
                      borderColor: 'sideBar.border',
                    })}
                  >
                    <Stack align="center" gap={2}>
                      <Avatar user={c.author} />
                      <Text size={3}>{c.author.username}</Text>
                    </Stack>
                  </Element>
                  <Comment source={c.content} />
                </>
              ))}
              <Element
                paddingX={4}
                css={css({
                  borderTop: '1px solid',
                  borderColor: 'sideBar.border',
                })}
              >
                <Textarea
                  autosize
                  css={css({ minHeight: 8, overflow: 'hidden' })}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder={comment ? 'Reply' : 'Write a comment...'}
                  onKeyDown={event => {
                    if (event.keyCode === ENTER && !event.shiftKey) onSubmit();
                  }}
                />
              </Element>
            </>
          )}
        </Stack>
      </Element>
    </Draggable>
  );
};
