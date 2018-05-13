import React from 'react';
import Tooltip from 'common/components/Tooltip';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { UpdateContainer, UpdateMessage } from './elements';

export default class UpdateFound extends React.PureComponent {
  state = {
    showTooltipManually: true,
  };

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ showTooltipManually: false });
    }, 10000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <UpdateContainer {...this.props}>
        <Tooltip
          theme="update"
          html={
            <UpdateMessage
              id="update-message"
              onClick={() => document.location.reload()}
            />
          }
          open={this.state.showTooltipManually}
          trigger={
            this.state.showTooltipManually ? 'manual' : 'mouseenter focus'
          }
          arrow
          distance={15}
        >
          <RefreshIcon />
        </Tooltip>
      </UpdateContainer>
    );
  }
}
