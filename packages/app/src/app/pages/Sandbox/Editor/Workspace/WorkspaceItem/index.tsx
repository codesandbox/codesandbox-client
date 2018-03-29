import * as React from 'react';
import ReactShow from 'react-show';

import {
  ChildContainer,
  ItemHeader,
  Title,
  ExpandIconContainer,
  Actions,
} from './elements';

type Props = {
  defaultOpen?: boolean
  disabled?: boolean
  title: string
  keepState: boolean
  actions: any
}

type State = {
  open: boolean
}

export default class WorkspaceItem extends React.Component<Props, State> {
  state: State
  constructor(props: Props) {
    super(props);
    this.state = {
      open: !!props.defaultOpen,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.open !== this.state.open ||
      nextProps.disabled !== this.props.disabled ||
      this.props.children !== nextProps.children
    );
  }

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title, keepState, disabled, actions } = this.props;
    const { open } = this.state;

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <ExpandIconContainer open={open} />
          <Title>{title}</Title>

          {open && <Actions>{actions}</Actions>}
        </ItemHeader>
        <ReactShow show={open} duration={250} unmountOnHide={!keepState}>
          <ChildContainer disabled={disabled}>{children}</ChildContainer>
        </ReactShow>
      </div>
    );
  }
}
