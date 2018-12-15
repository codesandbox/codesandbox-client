import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import ReactShow from 'react-show';
import ContextMenu from 'app/components/ContextMenu';
import {
  AnimatedChevron,
  Container,
  IconContainer,
  ItemName,
} from './elements';

const getContainer = contextItems => {
  if (contextItems) {
    return props => (
      <ContextMenu items={contextItems}>
        {React.createElement(Container, props)}
      </ContextMenu>
    );
  }

  return Container;
};

export default class Item extends React.Component {
  state = {
    open: this.props.openByDefault,
  };

  toggleOpen = e => {
    e.preventDefault();
    this.setState(state => ({ open: !state.open }));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.openByDefault === true && !this.props.openByDefault) {
      this.setState({ open: true });
    }
  }

  render() {
    const { name, contextItems, Icon, path, children, style } = this.props;

    const UsedContainer = getContainer(contextItems);
    return (
      <Route path={path}>
        {res => {
          const isOpen =
            this.state.open === undefined ? res.match : this.state.open;

          if (res.match && this.state.open === undefined) {
            this.setState({ open: true });
          }
          return (
            <Fragment>
              <UsedContainer
                style={style}
                to={path}
                activeClassName="active"
                exact
              >
                {children ? (
                  <AnimatedChevron onClick={this.toggleOpen} open={isOpen} />
                ) : (
                  <div
                    style={{ width: 16, height: 16, marginRight: '0.25rem' }}
                  />
                )}
                <IconContainer>
                  <Icon />
                </IconContainer>
                <ItemName>{name}</ItemName>
              </UsedContainer>

              {children && (
                <ReactShow show={isOpen} duration={250} unmountOnHide>
                  {children(res)}
                </ReactShow>
              )}
            </Fragment>
          );
        }}
      </Route>
    );
  }
}
