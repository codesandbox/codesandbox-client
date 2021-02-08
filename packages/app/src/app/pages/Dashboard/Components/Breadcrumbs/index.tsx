import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

interface BreadcrumbProps {
  path: string;
  activeTeam: string;
  repos?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  path,
  activeTeam,
  repos,
}) => (
  <Text marginBottom={1} block weight="bold" size={5}>
    <Link
      to={
        repos
          ? dashboard.repos(activeTeam)
          : dashboard.allSandboxes('/', activeTeam)
      }
      as={LinkBase}
      variant={path && path.split('/').length ? 'muted' : 'body'}
    >
      {repos ? 'Repositories' : 'All Sandboxes'} {path && ' / '}
    </Link>
    {path
      ? path.split('/').map((p, i) => {
          const partPath = path
            .split('/')
            .slice(0, i + 1)
            .join('/');

          return (
            <Link
              key={p}
              as={LinkBase}
              to={
                repos
                  ? dashboard.repos(activeTeam)
                  : dashboard.allSandboxes('/' + partPath, activeTeam)
              }
              variant={i < path.split('/').length - 1 ? 'muted' : 'body'}
            >
              {p} {i < path.split('/').length - 1 && '/ '}
            </Link>
          );
        })
      : null}
  </Text>
);
