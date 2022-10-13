import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

export interface BreadcrumbProps {
  path: string;
  activeTeam: string;
  nestedPageType?: 'repositories' | 'synced-sandboxes';
  albumId?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  path,
  activeTeam,
  nestedPageType,
  albumId,
}) => {
  let link = dashboard.sandboxes('/', activeTeam);
  if (nestedPageType) {
    link = {
      repositories: dashboard.repositories(activeTeam),
      'synced-sandboxes': dashboard.syncedSandboxes(activeTeam),
    }[nestedPageType];
  } else if (albumId) link = dashboard.discover(activeTeam);

  let prefix = 'All sandboxes';
  if (nestedPageType) {
    prefix = {
      'synced-sandboxes': 'Synced sandboxes',
      repositories: 'All repositories',
    }[nestedPageType];
  } else if (albumId) prefix = 'Discover';

  return (
    <Text block size={6}>
      <Link
        to={link}
        as={LinkBase}
        variant={path && path.split('/').length ? 'muted' : 'body'}
      >
        {prefix} {path && ' / '}
      </Link>
      {path &&
        nestedPageType !== 'repositories' &&
        path.split('/').map((currentPath, i, arr) => {
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
                nestedPageType
                  ? link
                  : dashboard.sandboxes('/' + partPath, activeTeam)
              }
              variant={i < path.split('/').length - 1 ? 'muted' : 'body'}
            >
              {currentPath} {i < path.split('/').length - 1 && '/ '}
            </Link>
          );
        })}
      {path && nestedPageType === 'repositories' && <span>{path}</span>}
    </Text>
  );
};
