import React from 'react';
import moment from 'moment';

import { Date, Button } from './elements';

export default class Sandbox extends React.PureComponent {
  setShowcase = () => {
    this.props.setShowcasedSandbox(this.props.sandbox.id);
  };

  render() {
    const { sandbox, active } = this.props;
    return (
      <Button active={active} onClick={this.setShowcase}>
        <div>
          {sandbox.title || sandbox.id}
          {active && ' (Selected)'}
        </div>
        <Date>{moment(sandbox.insertedAt).format('ll')}</Date>
      </Button>
    );
  }
}
