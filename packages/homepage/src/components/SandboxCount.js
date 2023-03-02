import { Component } from 'react';
import { search } from '../utils/algolia';

class SandboxCount extends Component {
  state = {
    sandboxes: undefined,
  };

  static defaultProps = {
    fallback: 900000,
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

    return number.toLocaleString('en-US');
  }
}

export default SandboxCount;
