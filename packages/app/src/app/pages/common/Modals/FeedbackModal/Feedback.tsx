import css from '@styled-system/css';
import VERSION from '@codesandbox/common/lib/version';
import { CurrentUser } from '@codesandbox/common/lib/types';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useAppState, useActions } from 'app/overmind';
import pushToAirtable from 'app/overmind/utils/pushToAirtable';
import pushToFront from 'app/overmind/utils/pushToFront';
import {
  Element,
  Input,
  Stack,
  Button,
  Textarea,
  Text,
} from '@codesandbox/components';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useState,
  useEffect,
} from 'react';
import { browser } from './getBrowser';
import { Alert } from '../Common/Alert';

type Props = {
  user?: CurrentUser;
};

export const Feedback: FunctionComponent<Props> = ({ user }) => {
  const { notificationAdded, modalClosed } = useActions();
  const { currentModalMessage } = useAppState();
  const [email, setEmail] = useState((user || {}).email);
  const [emoji, setEmoji] = useState(null);
  const [feedback, setFeedback] = useState(currentModalMessage || '');
  const [loading, setLoading] = useState(false);

  const listenForEsc = e => {
    if (e.keyCode === ESC) {
      modalClosed();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenForEsc);

    return () => window.removeEventListener('keydown', listenForEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const noop = () => undefined;
    const settersByInputName = {
      email: setEmail,
      feedback: setFeedback,
    };

    (settersByInputName[e.target.name] || noop)(e.target.value);
  };

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const data = {
      feedback,
      emoji,
      username: (user || {}).username,
      email,
      version: VERSION,
      browser: browser(),
    };

    setLoading(true);
    try {
      await pushToAirtable(data);
      await pushToFront(data);
      setEmoji(null);
      setFeedback('');
      setLoading(false);

      modalClosed();
      notificationAdded({
        notificationType: 'success',
        title: 'Thanks for your feedback!',
      });
    } catch (e) {
      notificationAdded({
        notificationType: 'error',
        title: `Something went wrong while sending feedback`,
      });

      setLoading(false);
    }
  };

  const setHappy = () => setEmoji('happy');
  const setSad = () => setEmoji('sad');

  return (
    <Alert title="Submit Feedback">
      <Element marginTop={4}>
        <form onSubmit={onSubmit}>
          <Textarea
            autosize
            minRows={3}
            name="feedback"
            // @ts-ignore
            onChange={onChange}
            placeholder="What are your thoughts?"
            required
            value={feedback}
          />

          {!user && (
            <Element marginTop={2} marginBottom={4}>
              <Input
                name="email"
                onChange={onChange}
                placeholder="Email if you wish to be contacted"
                type="email"
                value={email}
              />
            </Element>
          )}

          <Stack gap={2} align="center" marginTop={2} marginBottom={4}>
            <Button
              css={css({ width: 'auto' })}
              variant={emoji === 'happy' ? 'primary' : 'secondary'}
              onClick={setHappy}
            >
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <Text size={4} as="span" aria-label="happy" role="img">
                😊
              </Text>
            </Button>

            <Button
              css={css({ width: 'auto' })}
              variant={emoji === 'sad' ? 'primary' : 'secondary'}
              onClick={setSad}
            >
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <Text size={4} as="span" aria-label="sad" role="img">
                😞
              </Text>
            </Button>
          </Stack>

          <Stack justify="flex-end">
            <Button
              css={css({ width: 'auto' })}
              type="submit"
              disabled={loading || !feedback.trim()}
            >
              {loading ? 'Sending...' : 'Submit'}
            </Button>
          </Stack>
        </form>
      </Element>
    </Alert>
  );
};
