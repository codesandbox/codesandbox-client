import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version } from './elements';

export default class VersionEntry extends React.PureComponent {
  state = {
    hovering: false,
    version: null,
  };

  setVersionsForLatestPkg(pkg) {
    const that = this;
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => that.setState({ version: data.data.version }))
      .catch(err => console.err(err)); // eslint-disable-line no-console
  }

  componentWillMount() {
    const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
    const version = this.props.dependencies[this.props.dependency];
    if (!versionRegex.test(version)) {
      this.setVersionsForLatestPkg(`${this.props.dependency}@${version}`);
    }
  }

  handleRemove = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.onRemove(this.props.dependency);
  };
  handleRefresh = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.onRefresh(this.props.dependency);
  };
  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  render() {
    const { dependencies, dependency } = this.props;

    const { hovering } = this.state;
    return (
      <EntryContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Link href={`https://www.npmjs.com/package/${dependency}`}>
          {dependency}
        </Link>
        <Version hovering={hovering}>
          {dependencies[dependency]}{' '}
          {hovering &&
            this.state.version && <span>({this.state.version})</span>}
        </Version>
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
