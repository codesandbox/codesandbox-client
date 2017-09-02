import React from 'react';
import styled from 'styled-components';
import FeedbackIcon from 'react-icons/lib/go/comment-discussion';
import Button from 'app/components/buttons/Button';

import HoverMenu from './HoverMenu';
import Action from './Action';

const Container = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
`;

const MessageView = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  z-index: 2;
  border-radius: 4px;
  font-size: 0.875rem;

  color: rgba(255, 255, 255, 0.8);
  padding: 1rem;

  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.background2};

  width: 400px;

  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }

  textarea {
    background-color: rgba(255, 255, 255, 0.1);
    outline: none;
    border: none;
    width: 100%;
    box-sizing: border-box;
    color: white;
    margin-bottom: 0.5rem;
  }
`;

type Props = {
  sendMessage: (message: string) => void,
};

export default class FeedbackView extends React.PureComponent {
  props: Props;
  state = {
    message: '',
  };

  handleChange = e => this.setState({ message: e.target.value });

  handleSend = (toggle: Function) => () => {
    if (this.state.message !== '') {
      toggle();
      this.props.sendMessage(this.state.message);
      this.setState({ message: '' });
    }
  };

  render() {
    return (
      <Container>
        <HoverMenu
          HeaderComponent={Action}
          headerProps={{
            Icon: FeedbackIcon,
            tooltip: 'Give feedback',
          }}
        >
          {toggle => (
            <MessageView>
              <h3>Send feedback</h3>
              <textarea
                rows="5"
                value={this.state.message}
                placeholder="Ideas? Feedback? Thoughts? We'd love to hear them all!"
                onChange={this.handleChange}
              />
              <Button onClick={this.handleSend(toggle)}>Send</Button>
            </MessageView>
          )}
        </HoverMenu>
      </Container>
    );
  }
}
