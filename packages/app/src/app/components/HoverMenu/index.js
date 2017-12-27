import React from 'react';

export default class HoverMenu extends React.PureComponent {
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }
  handleDocumentClick = () => {
    this.props.onClose();
  };

  handleViewClick = event => {
    event.stopPropagation();
    this.props.onClose();
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
    return <div onClick={this.handleViewClick}>{children}</div>; // eslint-disable-line
  }
}
