import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import type { SmallSandbox } from 'common/types';

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  transition: 0.3s ease all;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background-color: white;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

type Props = {
  sandbox: SmallSandbox,
  setShowcasedSandbox: (shortid: string) => any,
};

export default class Sandbox extends React.PureComponent {
  props: Props;

  setShowcase = () => {
    this.props.setShowcasedSandbox(this.props.sandbox.id);
  };

  render() {
    const { sandbox } = this.props;
    return (
      <Button onClick={this.setShowcase}>
        {' '}<div>{sandbox.title || sandbox.id}</div>
        <div>{moment(sandbox.insertedAt).format('ll')}</div>
      </Button>
    );
  }
}
