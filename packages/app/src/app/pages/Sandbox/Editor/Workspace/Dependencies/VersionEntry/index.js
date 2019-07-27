import React, { Fragment } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version, MoreData, VersionSelect } from './elements';

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
    versions: [],
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad request');
        }

        return response.json();
      })
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

  UNSAFE_componentWillMount() {
    const { dependencies, dependency } = this.props;
    const client = algoliasearch(
      'OFCNCOG2CU',
      '00383ecd8441ead30b1b0ff981c426f5'
    );
    const index = client.initIndex('npm-search');
    index.getObject(dependency, ['versions']).then(({ versions: results }) => {
      const versions = Object.keys(results).sort((a, b) => {
        try {
          return compareVersions(b, a);
        } catch (e) {
          return 0;
        }
      });
      this.setState({
        versions,
      });
    });

    try {
      const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
      const version = dependencies[dependency];
      const cleanVersion = version.split('^');
      this.getSizeForPKG(
        `${dependency}@${cleanVersion[cleanVersion.length - 1]}`
      );
      if (!versionRegex.test(version)) {
        this.setVersionsForLatestPkg(`${dependency}@${version}`);
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

    if (typeof dependencies[dependency] !== 'string') {
      return null;
    }

    const { hovering, version, size, open, versions } = this.state;
    return (
      <Fragment>
        <EntryContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Link href={`https://www.npmjs.com/package/${dependency}`}>
            {dependency}
          </Link>
          <VersionSelect
            hovering={hovering}
            defaultValue={versions.find(v => v === dependencies[dependency])}
            onChange={e => {
              this.props.onRefresh(dependency, e.target.value);
              this.setState({ hovering: false });
            }}
          >
            {versions.map(a => (
              <option key={a}>{a}</option>
            ))}
          </VersionSelect>
          <Version withSize={!!size.size} hovering={hovering}>
            {dependencies[dependency]}{' '}
            {hovering && version && <span>({version})</span>}
          </Version>

          {hovering && (
            <IconArea>
              {size.size ? (
                <Tooltip
                  content={open ? 'Hide sizes' : 'Show sizes'}
                  style={{ outline: 'none' }}
                >
                  <Icon onClick={this.handleOpen}>
                    {open ? <ArrowDropUp /> : <ArrowDropDown />}
                  </Icon>
                </Tooltip>
              ) : null}
              <Tooltip content="Update to latest" style={{ outline: 'none' }}>
                <Icon onClick={this.handleRefresh}>
                  <RefreshIcon />
                </Icon>
              </Tooltip>
              <Tooltip content="Remove" style={{ outline: 'none' }}>
                <Icon onClick={this.handleRemove}>
                  <CrossIcon />
                </Icon>
              </Tooltip>
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
