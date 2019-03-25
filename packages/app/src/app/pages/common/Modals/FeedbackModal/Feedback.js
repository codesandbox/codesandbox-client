import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import AutosizeTextArea from '@codesandbox/common/lib/components/AutosizeTextArea';
import Input from '@codesandbox/common/lib/components/Input';
import pushToAirtable from 'app/store/utils/pushToAirtable';

import { EmojiButton } from './elements';

class Feedback extends React.Component {
  state = {
    feedback: '',
    email: (this.props.user || {}).email,
    emoji: null,
    loading: false,
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = evt => {
    const { id, user, signals } = this.props;
    const { feedback, emoji, email } = this.state;
    evt.preventDefault();

    this.setState({ loading: true }, () => {
      pushToAirtable({
        sandboxId: id,
        feedback,
        emoji,
        username: (user || {}).username,
        email,
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
    const { feedback, emoji, email } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <AutosizeTextArea
          css={`
            width: 100%;
          `}
          name="feedback"
          value={feedback}
          onChange={this.onChange}
          placeholder="What are your thoughts?"
          minRows={3}
          required
        />
        {!this.props.user && (
          <Margin top={0.5}>
            <Input
              css={`
                width: 100%;
              `}
              type="email"
              name="email"
              value={email}
              onChange={this.onChange}
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
