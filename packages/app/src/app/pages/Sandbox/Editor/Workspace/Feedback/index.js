import * as React from 'react';
import { inject, observer } from 'mobx-react';

class Feedback extends React.Component {
  state = {
    feedback: '',
    emoji: null,
  };

  onChange = e => {
    this.setState({ feedback: e.target.value });
  };

  onSubmit = e => {
    const { signals, id } = this.props;
    const { feedback, emoji } = this.state;
    e.preventDefault();
    signals.sendFeedback({
      sandboxId: id,
      feedback,
      emoji,
    });

    this.setState({
      feedback: '',
      emoji: null,
    });
  };

  render() {
    const { feedback } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={feedback}
          onChange={this.onChange}
          placeholder="Feedback"
        />
      </form>
    );
  }
}

export default inject('signals')(observer(Feedback));
