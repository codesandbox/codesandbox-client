import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { CurrentUser } from '@codesandbox/common/lib/types';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useState,
} from 'react';

import { useOvermind } from 'app/overmind';
import pushToAirtable from 'app/store/utils/pushToAirtable';

import {
  AutosizeTextArea,
  Button,
  ButtonContainer,
  EmojiButton,
  Input,
} from './elements';

type Props = {
  id: string;
  user?: CurrentUser;
};
const Feedback: FunctionComponent<Props> = ({ id, user }) => {
  const {
    actions: { notificationAdded, modalClosed },
  } = useOvermind();
  const [email, setEmail] = useState((user || {}).email);
  const [emoji, setEmoji] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    const noop = () => undefined;
    const settersByInputName = {
      email: setEmail,
      feedback: setFeedback,
    };

    (settersByInputName[name] || noop)(value);
  };

  const onSubmit = ({ preventDefault }: FormEvent<HTMLFormElement>) => {
    preventDefault();

    setLoading(true);

    pushToAirtable({
      sandboxId: id,
      feedback,
      emoji,
      username: (user || {}).username,
      email,
    })
      .then(() => {
        setEmoji(null);
        setFeedback('');
        setLoading(false);

        modalClosed();
        notificationAdded({
          notificationType: 'success',
          title: 'Thanks for your feedback!',
        });
      })
      .catch(({ message }) => {
        notificationAdded({
          notificationType: 'error',
          title: `Something went wrong while sending feedback: ${message}`,
        });

        setLoading(false);
      });
  };

  const setHappy = () => setEmoji('happy');
  const setSad = () => setEmoji('sad');

  return (
    <form onSubmit={onSubmit}>
      <AutosizeTextArea
        minRows={3}
        name="feedback"
        onChange={onChange}
        placeholder="What are your thoughts?"
        required
        value={feedback}
      />

      {!user && (
        <Margin top={0.5}>
          <Input
            name="email"
            onChange={onChange}
            placeholder="Email if you wish to be contacted"
            type="email"
            value={email}
          />
        </Margin>
      )}

      <Margin
        css={`
          display: flex;
          align-items: center;
        `}
        top={0.5}
      >
        <EmojiButton
          active={emoji === 'happy'}
          onClick={setHappy}
          type="button"
        >
          <span aria-label="happy" role="img">
            😊
          </span>
        </EmojiButton>

        <EmojiButton active={emoji === 'sad'} onClick={setSad} type="button">
          <span aria-label="sad" role="img">
            😞
          </span>
        </EmojiButton>

        <ButtonContainer>
          <Button disabled={loading || !feedback.trim()} small>
            {loading ? 'Sending...' : 'Submit'}
          </Button>
        </ButtonContainer>
      </Margin>
    </form>
  );
};

export default Feedback;
