import React, { Fragment } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version, MoreData } from './elements';

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

  return { unit, size: parseFloat(size).toFixed(1) };
};

export default class VersionEntry extends React.PureComponent {
  state = {
    hovering: false,
    version: null,
    open: false,
    size: {},
  };

  setVersionsForLatestPkg(pkg) {
    const that = this;
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => that.setState({ version: data.data.version }))
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  }

  getSizeForPKG(pkg) {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(response => response.json())
      .then(size =>
        this.setState({
          size,
        })
      )
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  }

  componentWillMount() {
    try {
      const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
      const version = this.props.dependencies[this.props.dependency];
      const cleanVersion = version.split('^');
      this.getSizeForPKG(
        `${this.props.dependency}@${cleanVersion[cleanVersion.length - 1]}`
      );
      if (!versionRegex.test(version)) {
        this.setVersionsForLatestPkg(`${this.props.dependency}@${version}`);
      }
    } catch (e) {
      console.error(e);
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
  handleOpen = () => this.setState(({ open }) => ({ open: !open }));

  render() {
    const { dependencies, dependency } = this.props;

    const { hovering, version, size, open } = this.state;
    return (
      <Fragment>
        <EntryContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Link href={`https://www.npmjs.com/package/${dependency}`}>
            {dependency}
          </Link>
          <Version withSize={!!size.size} hovering={hovering}>
            {dependencies[dependency]}{' '}
            {hovering && version && <span>({version})</span>}
          </Version>

          {hovering && (
            <IconArea>
              {size.size ? (
                <Icon onClick={this.handleOpen}>
                  {open ? <ArrowDropUp /> : <ArrowDropDown />}
                </Icon>
              ) : null}
              <Icon onClick={this.handleRefresh}>
                <RefreshIcon />
              </Icon>
              <Icon onClick={this.handleRemove}>
                <CrossIcon />
              </Icon>
            </IconArea>
          )}
        </EntryContainer>
        {open ? (
          <MoreData>
            <li>
              <span>Gzip:</span> {formatSize(size.gzip).size}
              {formatSize(size.gzip).unit}
            </li>
            <li>
              <span>Size:</span> {formatSize(size.size).size}
              {formatSize(size.size).unit}
            </li>
          </MoreData>
        ) : null}
      </Fragment>
    );
  }
}
