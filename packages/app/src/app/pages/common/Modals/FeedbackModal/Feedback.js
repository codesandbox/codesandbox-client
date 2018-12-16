import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';

import AutosizeTextArea from 'common/components/AutosizeTextArea';
import pushToAirtable from 'app/store/utils/pushToAirtable';

import { EmojiButton } from './elements';

function sendFeedback(props) {
  const { feedback, emoji, sandboxId, user } = props;
  const { username, email } = user || {};

  return pushToAirtable({ feedback, emoji, sandboxId, username, email });
}

class Feedback extends React.Component {
  state = {
    feedback: '',
    emoji: null,
    loading: false,
  };

  onChange = e => {
    this.setState({ feedback: e.target.value });
  };

  onSubmit = evt => {
    const { id, user, signals } = this.props;
    const { feedback, emoji } = this.state;
    evt.preventDefault();

    this.setState({ loading: true }, () => {
      sendFeedback({
        sandboxId: id,
        feedback,
        emoji,
        user,
      })
        .then(() => {
          this.setState(
            {
              feedback: '',
              emoji: null,
              loading: false,
            },
            () => {
              signals.modalClosed();

              signals.notificationAdded({
                message: `Thanks for your feedback!`,
                type: 'success',
              });
            }
          );
        })
        .catch(e => {
          signals.notificationAdded({
            message: `Something went wrong while sending feedback: ${
              e.message
            }`,
            type: 'error',
          });

          this.setState({ loading: false });
        });
    });
  };

  setHappy = () => {
    this.setState({ emoji: 'happy' });
  };
  setSad = () => {
    this.setState({ emoji: 'sad' });
  };

  render() {
    const { feedback, emoji } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <AutosizeTextArea
          css={`
            width: 100%;
          `}
          value={feedback}
          onChange={this.onChange}
          placeholder="What are your thoughts?"
          minRows={3}
        />

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
            onClick={this.setHappy}
          >
            <span role="img" aria-label="happy">
              😊
            </span>
          </EmojiButton>

          <EmojiButton
            type="button"
            active={emoji === 'sad'}
            onClick={this.setSad}
          >
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
              disabled={this.state.loading}
              small
              css={`
                float: right;
              `}
            >
              {this.state.loading ? 'Sending...' : 'Submit'}
            </Button>
          </div>
        </Margin>
      </form>
    );
  }
}

export default inject('signals')(observer(Feedback));
