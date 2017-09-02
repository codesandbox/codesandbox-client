import React from 'react';

type Props = {
  children: Function,
  onClose: Function,
};

type State = {
  clicked: boolean,
};

export default class HoverMenu extends React.PureComponent {
  props: Props;

  state: State = {
    clicked: false,
  };

  handleDocumentClick = () => {
    if (!this.state.clicked) {
      this.props.onClose();
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  handleViewClick = () => {
    // Prevent element from closing itself when you click on it
    this.setState({ clicked: true });

    setTimeout(() => {
      this.setState({ clicked: false });
    });
  };

  setOnclickListener = el => {
    this.element = el;
    if (el) {
      el.addEventListener('click', this.handleViewClick);
    }
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);

    if (this.element) {
      this.element.removeEventListener('click', this.handleViewClick);
    }
  }

  render() {
    const { children } = this.props;
    return <div ref={this.setOnclickListener}>{children}</div>;
  }
}
