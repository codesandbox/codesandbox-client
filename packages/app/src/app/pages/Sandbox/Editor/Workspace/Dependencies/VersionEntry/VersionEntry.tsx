import React, { useState, useEffect } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';
import algoliasearch from 'algoliasearch/lite';
import compareVersions from 'compare-versions';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { useSignals } from 'app/store';
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

export const VersionEntry = ({ isDev = false, dependencies, dependency }) => {
  const [isHovering, setHovering] = useState(false);
  const [version, setVersion] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [size, setSize] = useState({});
  const [versions, setVersions] = useState([]);
  const {
    editor: { addNpmDependency, npmDependencyRemoved },
  } = useSignals();

  const setVersionsForLatestPkg = pkg => {
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad request');
        }

        return response.json();
      })
      .then(({ data }) => setVersion(data.version))
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  };

  const getSizeForPKG = pkg => {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad request');
        }

        return response.json();
      })
      .then(val => setSize(val))
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err); // eslint-disable-line no-console
        }
      });
  };

  useEffect(() => {
    const client = algoliasearch(
      `OFCNCOG2CU`,
      `00383ecd8441ead30b1b0ff981c426f5`
    );
    const index = client.initIndex('npm-search');
    index.getObject(dependency, ['versions']).then(({ versions: results }) => {
      setVersions(
        Object.keys(results).sort((a, b) => {
          try {
            return compareVersions(b, a);
          } catch (e) {
            return 0;
          }
        })
      );
    });

    try {
      const versionRegex = /^\d{1,3}\.\d{1,3}.\d{1,3}$/;
      const ver = dependencies[dependency];
      const cleanVersion = ver.split('^');
      getSizeForPKG(`${dependency}@${cleanVersion[cleanVersion.length - 1]}`);
      if (!versionRegex.test(ver)) {
        setVersionsForLatestPkg(`${dependency}@${ver}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [dependencies, dependency]);

  const handleRemove = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    npmDependencyRemoved({ name: dependency, isDev });
  };

  const handleChange = e => {
    addNpmDependency({
      name: dependency,
      version: e.target.value,
      isDev,
    });
    setHovering(false);
  };

  const handleRefresh = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addNpmDependency({ name: dependency, isDev });
  };

  if (typeof dependencies[dependency] !== 'string') {
    return null;
  }

  return (
    <>
      <EntryContainer
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Link href={`https://www.npmjs.com/package/${dependency}`}>
          {dependency}
        </Link>
        <VersionSelect hovering={isHovering} onChange={handleChange}>
          {versions.map(a => (
            <option key={a} selected={a === dependencies[dependency]}>
              {a}
            </option>
          ))}
        </VersionSelect>
        <Version withSize={!!size.size} hovering={isHovering}>
          {dependencies[dependency]}{' '}
          {isHovering && version && <span>({version})</span>}
        </Version>

        {isHovering && (
          <IconArea>
            {size.size ? (
              <Tooltip
                content={isOpen ? 'Hide sizes' : 'Show sizes'}
                style={{ outline: 'none' }}
              >
                <Icon onClick={() => setOpen(!isOpen)}>
                  {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                </Icon>
              </Tooltip>
            ) : null}
            <Tooltip content="Update to latest" style={{ outline: 'none' }}>
              <Icon onClick={handleRefresh}>
                <RefreshIcon />
              </Icon>
            </Tooltip>
            <Tooltip content="Remove" style={{ outline: 'none' }}>
              <Icon onClick={handleRemove}>
                <CrossIcon />
              </Icon>
            </Tooltip>
          </IconArea>
        )}
      </EntryContainer>
      {isOpen ? (
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
    </>
  );
};
