import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

interface BreadcrumbProps {
  path: string;
  activeTeam: string;
  repos?: 'legacy' | 'open-source';
  albumId?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  path,
  activeTeam,
  repos,
  albumId,
}) => {
  let link = dashboard.allSandboxes('/', activeTeam);
  if (repos) {
    link = {
      'open-source': dashboard.openSourceRepos(activeTeam),
      legacy: dashboard.legacyRepos(activeTeam),
    }[repos];
  } else if (albumId) link = dashboard.discover(activeTeam);

  let prefix = 'All Sandboxes';
  if (repos) {
    prefix = {
      'open-source': 'Open source',
      legacy: 'Legacy repositories',
    }[repos];
  } else if (albumId) prefix = 'Discover';

  return (
    <Text marginBottom={1} block weight="bold" size={5}>
      <Link
        to={link}
        as={LinkBase}
        variant={path && path.split('/').length ? 'muted' : 'body'}
      >
        {prefix} {path && ' / '}
      </Link>
      {path
        ? path.split('/').map((currentPath, i, arr) => {
            const partPath = path
              .split('/')
              .slice(0, i + 1)
              .join('/');

            const isCurrent = i + 1 === arr.length;

            if (isCurrent) {
              return currentPath;
            }

            return (
              <Link
                key={currentPath}
                as={LinkBase}
                to={
                  repos
                    ? dashboard.repos(activeTeam)
                    : dashboard.allSandboxes('/' + partPath, activeTeam)
                }
                variant={i < path.split('/').length - 1 ? 'muted' : 'body'}
              >
                {currentPath} {i < path.split('/').length - 1 && '/ '}
              </Link>
            );
          })
        : null}
    </Text>
  );
};
