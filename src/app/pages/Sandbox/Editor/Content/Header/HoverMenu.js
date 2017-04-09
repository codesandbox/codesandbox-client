import React from 'react';

type Props = {
  HeaderComponent: React.Component<any, any>,
  headerProps: ?Object,
};

type State = {
  open: boolean,
};

export default class HoverMenu extends React.PureComponent {
  props: Props;

  state: State = {
    open: false,
    clicked: false,
  };

  handleDocumentClick = e => {
    if (this.state.open && !e.defaultPrevented && !this.state.clicked) {
      this.setState({ open: false });
    }
  };

  setOnclickListener = el => {
    el.addEventListener('click', e => {
      // Prevent element from closing itself when you click on it
      this.setState({ clicked: true });

      setTimeout(() => {
        this.setState({ clicked: false });
      });
    });

    document.addEventListener('click', this.handleDocumentClick);
  };

  commponentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  toggle = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ open: !this.state.open });
  };

  render() {
    const { children, HeaderComponent, headerProps = {} } = this.props;
    const { open } = this.state;
    return (
      <span>
        <HeaderComponent {...headerProps} onClick={this.toggle} />
        <div ref={this.setOnclickListener}>
          {open && children}
        </div>
      </span>
    );
  }
}
