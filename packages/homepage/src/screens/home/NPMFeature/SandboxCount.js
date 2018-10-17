import React, { Fragment, Component } from 'react';
import { search } from '../../../utils/algolia';

class SandboxCount extends Component {
  state = {
    sandboxes: undefined,
  };
  static defaultProps = {
    fallback: 800000,
  };

  componentDidMount() {
    search({
      attributesToRetrieve: [],
      attributesToHighlight: [],
      hitsPerPage: 1,
    }).then(({ nbHits }) =>
      this.setState({
        sandboxes: nbHits,
      })
    );
  }

  render() {
    const { fallback } = this.props;
    const { sandboxes } = this.state;
    const number = sandboxes || fallback;
    return <Fragment>{number.toLocaleString('en-US')}</Fragment>;
  }
}

export default SandboxCount;
