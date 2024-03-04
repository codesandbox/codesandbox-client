import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { ROOT_COLLECTION_NAME } from '../../Sidebar';

export interface BreadcrumbProps {
  path: string;
  activeTeam: string;
  nestedPageType?: 'repository-branches' | 'synced-sandboxes';
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
      'repository-branches': dashboard.repositories(activeTeam),
      'synced-sandboxes': dashboard.syncedSandboxes(activeTeam),
    }[nestedPageType];
  }

  let prefix = ROOT_COLLECTION_NAME;
  if (nestedPageType) {
    prefix = {
      'synced-sandboxes': 'Imported templates',
      'repository-branches': 'All repositories',
    }[nestedPageType];
  }

  return (
    <Text block size={6}>
      {path ? (
        <Link to={link} as={LinkBase}>
          {prefix} {path && ' / '}
        </Link>
      ) : (
        <Text>{prefix}</Text>
      )}

      {path &&
        nestedPageType !== 'repository-branches' &&
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
            >
              {currentPath} {i < path.split('/').length - 1 && '/ '}
            </Link>
          );
        })}
      {path && nestedPageType === 'repository-branches' && <span>{path}</span>}
    </Text>
  );
};
