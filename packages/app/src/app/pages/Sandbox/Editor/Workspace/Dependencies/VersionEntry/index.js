import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version } from './elements';

const formatSize = value => {
  let unit;
  let size;
  if (Math.log10(value) < 3) {
    unit = 'B';
    size = value;
  } else if (Math.log10(value) < 6) {
    unit = 'kB';
    size = value / 1024;
  } else {
    unit = 'mB';
    size = value / 1024 / 1024;
  }

  return { unit, size };
};

export default class VersionEntry extends React.PureComponent {
  state = {
    hovering: false,
    version: null,
    size: {},
  };

  setVersionsForLatestPkg(pkg) {
    const that = this;
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => that.setState({ version: data.data.version }))
      .catch(err => console.err(err)); // eslint-disable-line no-console
  }

  getSizeForPKG(pkg) {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(response => response.json())
      .then(data => {
        const { unit, size } = formatSize(data.size);
        this.setState({
          size: {
            number: parseFloat(size).toFixed(1),
            unit,
          },
        });
      })
      .catch(err => console.err(err)); // eslint-disable-line no-console
  }

  componentWillMount() {
    const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
    const version = this.props.dependencies[this.props.dependency];
    this.getSizeForPKG(`${this.props.dependency}@${version}`);
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

    const { hovering, version, size } = this.state;
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
          {hovering && version && <span>({version})</span>}
          {size.number && <span>({size.number + size.unit})</span>}
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
