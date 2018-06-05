import React, { Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
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
    return ({ children, ...props }) => (
      <ContextMenu items={contextItems}>
        <Container {...props}>{children}</Container>
      </ContextMenu>
    );
  }

  return Container;
};

export default class Item extends React.Component {
  state = {
    open: undefined,
  };

  toggleOpen = e => {
    e.preventDefault();
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { name, contextItems, Icon, path, children, style } = this.props;

    const UsedContainer = getContainer(contextItems);
    return (
      <Route path={path}>
        {res => {
          const isOpen =
            this.state.open === undefined ? res.match : this.state.open;
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
