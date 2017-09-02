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
  background-color: ${props => (props.active ? '#eee' : 'white')};
  padding: 1rem;
  color: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #ddd;
  text-align: left;
  ${props => props.active && 'font-weight: 600'};
  cursor: ${props => (props.active ? 'default' : 'pointer')};

  &:hover {
    background-color: #eee;
  }
`;

const Date = styled.div`color: rgba(0, 0, 0, 0.6);`;

type Props = {
  sandbox: SmallSandbox,
  active: boolean,
  setShowcasedSandbox: (shortid: string) => any,
};

export default class Sandbox extends React.PureComponent {
  props: Props;

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
