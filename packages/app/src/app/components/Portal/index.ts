import * as React from 'react';
import * as ReactDOM from 'react-dom';

type Props = {
  children: React.ReactElement<any>
}

export default class Portal extends React.Component<Props> {
  popup: HTMLDivElement
  componentDidMount() {
    this.popup = document.createElement('div');
    document.body.appendChild(this.popup);
    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
  }

  renderLayer() {
    ReactDOM.render(this.props.children, this.popup);
  }

  render() {
    // Render a placeholder
    return null;
  }
}
