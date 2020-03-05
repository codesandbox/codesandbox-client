import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { formatVersion } from '@codesandbox/common/lib/utils/ci';

import css from '@styled-system/css';
import {
  ListAction,
  Stack,
  SidebarRow,
  Select,
  Text,
  Link,
  Button,
} from '@codesandbox/components';

import { BundleSizes } from './BundleSizes';

interface Props {
  dependencies: { [dep: string]: string };
  dependency: string;
  onRemove: (dep: string) => void;
  onRefresh: (dep: string, version?: string) => void;
}

interface State {
  version: null | string;
  open: boolean;
  versions: string[];
}

export class Dependency extends React.PureComponent<Props, State> {
  state: State = {
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

    // @ts-ignore
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

  handleOpen = () => this.setState(({ open }) => ({ open: !open }));

  render() {
    const { dependencies, dependency } = this.props;

    if (typeof dependencies[dependency] !== 'string') {
      return null;
    }

    const { version, open, versions } = this.state;
    return (
      <>
        <ListAction
          justify="space-between"
          align="center"
          css={css({
            position: 'relative',
            '.actions': {
              backgroundColor: 'sideBar.background',
              display: 'none',
            },
            ':hover .actions': {
              backgroundColor: 'list.hoverBackground',
              display: 'flex',
            },
          })}
        >
          <Link
            href={`https://www.npmjs.com/package/${dependency}`}
            target="_blank"
            css={{ position: 'absolute' }}
          >
            {dependency}
          </Link>

          <Stack
            align="center"
            justify="flex-end"
            css={css({
              position: 'absolute',
              right: 2,
              flexGrow: 0,
              flexShrink: 1,
              width: '100%',
            })}
          >
            <Text variant="muted" maxWidth="30%">
              {formatVersion(dependencies[dependency])}{' '}
              {version && <span>({formatVersion(version)})</span>}
            </Text>
          </Stack>

          <Stack
            className="actions"
            align="center"
            justify="flex-end"
            css={css({
              position: 'absolute',
              right: 0,
              width: '150px', // overlay on text
            })}
          >
            <Select
              css={{ width: '80px' }}
              defaultValue={versions.find(v => v === dependencies[dependency])}
              onChange={e => {
                this.props.onRefresh(dependency, e.target.value);
              }}
            >
              {versions.map(a => (
                <option key={a}>{a}</option>
              ))}
            </Select>

            <SingletonTooltip>
              {singleton => (
                <>
                  <Tooltip
                    content={open ? 'Hide sizes' : 'Show sizes'}
                    style={{ outline: 'none' }}
                    singleton={singleton}
                  >
                    <Button
                      variant="link"
                      onClick={this.handleOpen}
                      css={css({ minWidth: 5 })}
                    >
                      {open ? <ArrowDropUp /> : <ArrowDropDown />}
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Update to latest"
                    style={{ outline: 'none' }}
                    singleton={singleton}
                  >
                    <Button
                      variant="link"
                      onClick={this.handleRefresh}
                      css={css({ minWidth: 5 })}
                    >
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Remove"
                    style={{ outline: 'none' }}
                    singleton={singleton}
                  >
                    <Button
                      variant="link"
                      onClick={this.handleRemove}
                      css={css({ minWidth: 5 })}
                    >
                      <CrossIcon />
                    </Button>
                  </Tooltip>
                </>
              )}
            </SingletonTooltip>
          </Stack>
        </ListAction>
        {open ? (
          <SidebarRow marginX={2}>
            <BundleSizes
              dependency={dependency}
              version={dependencies[dependency]}
            />
          </SidebarRow>
        ) : null}
      </>
    );
  }
}
