import * as React from 'react';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import AutosizeTextArea from '@codesandbox/common/lib/components/AutosizeTextArea';
import Input from '@codesandbox/common/lib/components/Input';
import pushToAirtable from 'app/store/utils/pushToAirtable';

import { useOvermind } from 'app/overmind';
import { EmojiButton } from './elements';

const Feedback = props => {
  const {
    actions: { modalClosed, notificationAdded },
  } = useOvermind();
  const { id, user } = props;
  const [feedback, setFeedback] = React.useState('');
  const [email, setEmail] = React.useState((user || {}).email);
  const [emoji, setEmoji] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const setHappy = () => setEmoji('happy');

  const setSad = () => setEmoji('sad');

  const onSubmit = async evt => {
    evt.preventDefault();
    setLoading(true);
    try {
      await pushToAirtable({
        sandboxId: id,
        feedback,
        emoji,
        username: (user || {}).username,
        email,
      });
      setFeedback('');
      setEmoji(null);
      setLoading(false);

      modalClosed();
      notificationAdded({
        title: `Thanks for your feedback!`,
        notificationType: 'success',
      });
    } catch (e) {
      notificationAdded({
        title: `Something went wrong while sending feedback: ${e.message}`,
        notificationType: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <AutosizeTextArea
        css={`
          width: 100%;
        `}
        name="feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="What are your thoughts?"
        minRows={3}
        required
      />
      {!user && (
        <Margin top={0.5}>
          <Input
            css={`
              width: 100%;
            `}
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email if you wish to be contacted"
          />
        </Margin>
      )}

      <Margin
        top={0.5}
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <EmojiButton
          type="button"
          active={emoji === 'happy'}
          onClick={setHappy}
        >
          <span role="img" aria-label="happy">
            😊
          </span>
        </EmojiButton>

        <EmojiButton type="button" active={emoji === 'sad'} onClick={setSad}>
          <span role="img" aria-label="sad">
            😞
          </span>
        </EmojiButton>

        <div
          css={`
            flex: 1;
          `}
        >
          <Button
            disabled={loading}
            small
            css={`
              float: right;
            `}
          >
            {loading ? 'Sending...' : 'Submit'}
          </Button>
        </div>
      </Margin>
    </form>
  );
};

export default Feedback;
