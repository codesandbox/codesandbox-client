import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';

interface BreadcrumbProps {
  path: string;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ path }) => (
  <Text marginBottom={1} block weight="bold" size={5}>
    <Link
      to="/new-dashboard/all/"
      as={LinkBase}
      variant={path && path.split('/').length ? 'muted' : 'body'}
    >
      All Sandboxes {path && ' / '}
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
              to={`/new-dashboard/all/${partPath}`}
              variant={i < path.split('/').length - 1 ? 'muted' : 'body'}
            >
              {p} {i < path.split('/').length - 1 && '/ '}
            </Link>
          );
        })
      : null}
  </Text>
);
