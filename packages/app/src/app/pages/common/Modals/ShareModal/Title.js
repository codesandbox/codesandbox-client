import React, { Component, Fragment } from 'react';
import Down from 'react-icons/lib/fa/angle-down';
import Right from 'react-icons/lib/fa/angle-right';
import { Spring, animated } from 'react-spring';
import { Title } from './elements';

export default class extends Component {
  state = { open: this.props.open || false };

  toggleShow = () => this.setState(({ open }) => ({ open: !open }));

  render() {
    const { children, title } = this.props;
    const { open } = this.state;
    return (
      <Fragment>
        <Title onClick={() => this.toggleShow()}>
          {open ? <Down /> : <Right />}
          {title}
        </Title>
        <Spring
          from={{ height: 'auto' }}
          to={{
            height: open ? 'auto' : 0,
            overflow: 'hidden',
          }}
        >
          {props => <animated.div style={props}>{children}</animated.div>}
        </Spring>
      </Fragment>
    );
  }
}
