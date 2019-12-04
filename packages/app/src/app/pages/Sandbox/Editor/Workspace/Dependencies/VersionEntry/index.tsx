import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { formatVersion } from '@codesandbox/common/lib/utils/ci';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';
import { Version, VersionSelect } from './elements';
import { BundleSizes } from './BundleSizes';

interface Props {
  dependencies: { [dep: string]: string };
  dependency: string;
  onRemove: (dep: string) => void;
  onRefresh: (dep: string, version?: string) => void;
}

interface State {
  hovering: boolean;
  version: null | string;
  open: boolean;
  versions: string[];
}

export class VersionEntry extends React.PureComponent<Props, State> {
  state: State = {
    hovering: false,
    version: null,
    open: false,
    versions: [],
  };

  setVersionsForLatestPkg(pkg: string) {
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

    const { hovering, version, open, versions } = this.state;
    return (
      <>
        <EntryContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Link href={`https://www.npmjs.com/package/${dependency}`}>
            {dependency}
          </Link>
          <VersionSelect
            hovering={hovering}
            onChange={e => {
              this.props.onRefresh(dependency, e.target.value);
              this.setState({ hovering: false });
            }}
          >
            {versions.map(a => (
              <option key={a} selected={a === dependencies[dependency]}>
                {a}
              </option>
            ))}
          </VersionSelect>
          <Version hovering={hovering}>
            {formatVersion(dependencies[dependency])}{' '}
            {hovering && version && <span>({formatVersion(version)})</span>}
          </Version>

          {hovering && (
            <IconArea>
              <Tooltip
                content={open ? 'Hide sizes' : 'Show sizes'}
                style={{ outline: 'none' }}
              >
                <Icon onClick={this.handleOpen}>
                  {open ? <ArrowDropUp /> : <ArrowDropDown />}
                </Icon>
              </Tooltip>
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
          <BundleSizes
            dependency={dependency}
            version={dependencies[dependency]}
          />
        ) : null}
      </>
    );
  }
}
