import * as React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version } from './elements';

type Props = {
  dependencies: {
    [name: string]: string
  }
  dependency: string
  onRemove: (name: string) => void
  onRefresh: (name: string, version: string) => void
}

type State = {
  hovering: boolean
  version: string
}

export default class VersionEntry extends React.PureComponent<Props, State> {
  state: State = {
    hovering: false,
    version: null,
  };

  setVersionsForLatestPkg(pkg) {
    const that = this;
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => that.setState({ version: data.data.version }))
      .catch(err => console.error(err));
  }

  componentWillMount() {
    if (this.props.dependencies[this.props.dependency] === 'latest') {
      this.setVersionsForLatestPkg(`${this.props.dependency}@latest`);
    }
  }

  handleRemove = () => this.props.onRemove(this.props.dependency);
  handleRefresh = () => this.props.onRefresh(this.props.dependency, this.state.version);
  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  render() {
    const { dependencies, dependency } = this.props;
    const version =
      dependencies[dependency] === 'latest' && this.state.version
        ? `latest (${this.state.version})`
        : dependencies[dependency];
    const { hovering } = this.state;
    return (
      <EntryContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Link href={`https://www.npmjs.com/package/${dependency}`}>
          {dependency}
        </Link>
        <Version hovering={hovering}>{version}</Version>
        {hovering && (
          <IconArea>
            <Icon onClick={this.handleRefresh}>
              <RefreshIcon />
            </Icon>
            <Icon onClick={this.handleRemove}>
              <CrossIcon />
            </Icon>
          </IconArea>
        )}
      </EntryContainer>
    );
  }
}
