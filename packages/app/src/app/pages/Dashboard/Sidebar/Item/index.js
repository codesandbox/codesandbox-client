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
    const {
      name,
      contextItems,
      Icon,
      path,
      children,
      style,
      active,
      ...props
    } = this.props;

    const UsedContainer = getContainer(contextItems);

    return (
      <Route path={path}>
        {res => {
          const isActive = (res.match && res.match.isExact) || active;
          const isOpen =
            this.state.open === undefined ? isActive : this.state.open;

          if (
            (res.match || isActive) &&
            this.state.open === undefined &&
            children
          ) {
            this.setState({ open: true });
          }
          return (
            <Fragment>
              <UsedContainer
                style={style}
                to={path}
                exact
                active={isActive}
                {...props}
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
                  {children}
                </ReactShow>
              )}
            </Fragment>
          );
        }}
      </Route>
    );
  }
}
