import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { formatVersion } from '@codesandbox/common/lib/utils/ci';
import {
  Button,
  Link,
  ListAction,
  Select,
  SidebarRow,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import React, { FunctionComponent, useEffect, useState } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';

import { useOvermind } from 'app/overmind';

import { BundleSizes } from './BundleSizes';

const client = algoliasearch('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');
const index = client.initIndex('npm-search');

type Props = {
  dependencies: { [dependency: string]: string };
  dependency: string;
};
export const Dependency: FunctionComponent<Props> = ({
  dependencies,
  dependency,
}) => {
  const {
    actions: {
      editor: { addNpmDependency, npmDependencyRemoved },
    },
  } = useOvermind();
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(null);
  const [versions, setVersions] = useState([]);

  const setVersionsForLatestPkg = (pkg: string) => {
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(({ data }) => setVersion(data.version))
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  };
  useEffect(() => {
    // @ts-ignore
    index.getObject(dependency, ['versions']).then(({ versions: results }) => {
      const orderedVersions = Object.keys(results).sort((a, b) => {
        try {
          return compareVersions(b, a);
        } catch {
          return 0;
        }
      });
      setVersions(orderedVersions);
    });

    try {
      const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
      const propVersion = dependencies[dependency];
      if (!versionRegex.test(propVersion)) {
        setVersionsForLatestPkg(`${dependency}@${propVersion}`);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    npmDependencyRemoved(dependency);
  };
  const handleRefresh = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    addNpmDependency({ name: dependency });
  };

  if (typeof dependencies[dependency] !== 'string') {
    return null;
  }

  return (
    <>
      <ListAction
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
        justify="space-between"
      >
        <Link
          css={{ position: 'absolute', zIndex: 2 }}
          href={`/examples/package/${dependency}`}
          target="_blank"
        >
          {dependency}
        </Link>

        <Stack
          align="center"
          css={css({
            position: 'absolute',
            right: 2,
            flexGrow: 0,
            flexShrink: 1,
            width: '100%',
          })}
          justify="flex-end"
        >
          <Text maxWidth="30%" variant="muted">
            {`${formatVersion(dependencies[dependency])} (${formatVersion(
              version
            )})`}
          </Text>
        </Stack>

        <Stack
          align="center"
          css={css({
            position: 'absolute',
            right: 0,
            width: 'auto',
            zIndex: 2, // overlay on dependency name
            paddingLeft: 1,
          })}
          className="actions"
          justify="flex-end"
        >
          <Select
            css={{ width: '80px' }}
            onChange={({ target: { value } }) =>
              addNpmDependency({ name: dependency, version: value })
            }
            value={versions.find(v => v === dependencies[dependency])}
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
                  singleton={singleton}
                  style={{ outline: 'none' }}
                >
                  <Button
                    css={css({ minWidth: 5 })}
                    onClick={() => setOpen(show => !show)}
                    variant="link"
                  >
                    {open ? <ArrowDropUp /> : <ArrowDropDown />}
                  </Button>
                </Tooltip>

                <Tooltip
                  content="Update to latest"
                  singleton={singleton}
                  style={{ outline: 'none' }}
                >
                  <Button
                    css={css({ minWidth: 5 })}
                    onClick={handleRefresh}
                    variant="link"
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
                    css={css({ minWidth: 5 })}
                    onClick={handleRemove}
                    variant="link"
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
};
