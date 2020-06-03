import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';

export const Breadcrumbs = ({ param }) => {
  if (!param) return null;

  const makeLink = p =>
    param && param.split('/').length > 2
      ? `/new-dashboard/all/${param
          .split('/')
          .slice(0, -1)
          .map(a => a)}` +
        '/' +
        p
      : `/new-dashboard/all/${p}`;

  return (
    <Text marginBottom={1} block weight="bold" size={5}>
      <Link
        to="/new-dashboard/all/"
        as={LinkBase}
        variant={param && param.split('/').length ? 'muted' : 'body'}
      >
        All Sandboxes {param && ' / '}
      </Link>
      {param
        ? param.split('/').map((p, i) => (
            <Link
              key={p}
              as={LinkBase}
              to={makeLink(p)}
              variant={i < param.split('/').length - 1 ? 'muted' : 'body'}
            >
              {p} {i < param.split('/').length - 1 && '/ '}
            </Link>
          ))
        : null}
    </Text>
  );
};
