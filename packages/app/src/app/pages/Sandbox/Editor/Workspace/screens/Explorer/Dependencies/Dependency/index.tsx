import React, { useState, useEffect } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { packageExamplesUrl } from '@codesandbox/common/lib/utils/url-generator';
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
  Icon,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { isPrivateScope } from 'app/utils/private-registry';

import { BundleSizes } from './BundleSizes';

interface Props {
  dependencies: { [dep: string]: string };
  dependency: string;
  onRemove: (dep: string) => void;
  onRefresh: (dep: string, version?: string) => void;
}

const client = algoliasearch('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');
const index = client.initIndex('npm-search');

export const Dependency = ({
  dependencies,
  dependency,
  onRemove,
  onRefresh,
}: Props) => {
  const state = useAppState();

  const [version, setVersion] = useState(null);
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState([]);

  const isPrivatePackage =
    state.editor.currentSandbox &&
    isPrivateScope(state.editor.currentSandbox, dependency);

  const isPrivatePackageInPublicSandbox =
    isPrivatePackage && state.editor.currentSandbox?.privacy !== 2;

  const setVersionsForLatestPkg = (pkg: string) => {
    if (isPrivatePackage) {
      return;
    }

    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => setVersion(data.data.version))
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  };

  useEffect(() => {
    if (isPrivatePackage) {
      return;
    }

    // @ts-ignore
    index.getObject(dependency, ['versions']).then(({ versions: results }) => {
      const orderedVersions = Object.keys(results).sort((a, b) => {
        try {
          return compareVersions(b, a);
        } catch (e) {
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
  }, [isPrivatePackage]);

  const handleRemove = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onRemove(dependency);
  };

  const handleRefresh = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onRefresh(dependency);
  };

  if (typeof dependencies[dependency] !== 'string') {
    return null;
  }

  const versionFromDropdown = versions.find(
    v => v === dependencies[dependency]
  );

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
          href={packageExamplesUrl(dependency)}
          target="_blank"
          title={dependency}
          maxWidth="60%"
          css={{
            position: 'absolute',
            zIndex: 2,
            maxWidth: '60%',
          }}
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
          {isPrivatePackageInPublicSandbox ? (
            <Icon width={18} height={18} color="orange" name="warning" />
          ) : (
            <Text variant="muted" maxWidth="30%">
              {formatVersion(dependencies[dependency])}{' '}
              {version && <span>({formatVersion(version)})</span>}
            </Text>
          )}
        </Stack>

        <Stack
          className="actions"
          align="center"
          justify="flex-end"
          css={css({
            position: 'absolute',
            right: 0,
            width: 'auto',
            zIndex: 2, // overlay on dependency name
            paddingLeft: 1,
          })}
        >
          {versions.length === 0 ? null : (
            <Select
              css={{ width: '80px' }}
              value={versionFromDropdown || dependencies[dependency]}
              onChange={e => onRefresh(dependency, e.target.value)}
            >
              {versionFromDropdown === undefined && (
                <option key={dependencies[dependency]}>
                  {dependencies[dependency]}
                </option>
              )}
              {versions.map(a => (
                <option key={a}>{a}</option>
              ))}
            </Select>
          )}

          <SingletonTooltip>
            {singleton => (
              <>
                {!isPrivatePackage && (
                  <Tooltip
                    content={open ? 'Hide sizes' : 'Show sizes'}
                    style={{ outline: 'none' }}
                    singleton={singleton}
                  >
                    <Button
                      variant="link"
                      onClick={() => setOpen(!open)}
                      css={css({ minWidth: 5 })}
                    >
                      {open ? <ArrowDropUp /> : <ArrowDropDown />}
                    </Button>
                  </Tooltip>
                )}

                {isPrivatePackageInPublicSandbox ? (
                  <Tooltip
                    content="Private packages only work in private sandboxes"
                    style={{ outline: 'none', display: 'flex' }}
                    singleton={singleton}
                  >
                    <Icon
                      width={18}
                      height={18}
                      color="orange"
                      name="warning"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    content="Update to latest"
                    style={{ outline: 'none' }}
                    singleton={singleton}
                  >
                    <Button
                      variant="link"
                      onClick={handleRefresh}
                      css={css({ minWidth: 5 })}
                    >
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  content="Remove"
                  style={{ outline: 'none' }}
                  singleton={singleton}
                >
                  <Button
                    variant="link"
                    onClick={handleRemove}
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
};
