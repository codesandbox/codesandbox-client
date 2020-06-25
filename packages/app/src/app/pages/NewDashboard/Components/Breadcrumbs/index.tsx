import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';

export const Breadcrumbs = ({ param, repos }) => {
  const params = param.split('/').length - 1;

  const makeLink = (p: string, link: string) => {
    if (param && param.split('/').length > 2) {
      return (
        `/new-dashboard/${link}/${param
          .split('/')
          .slice(0, -1)
          .map(a => a)}` +
        '/' +
        p
      );
    }
    return `/new-dashboard/${link}/${p}`;
  };

  return (
    <Text marginBottom={1} block weight="bold" size={5}>
      <Link
        to={`/new-dashboard/${repos ? 'repositories' : 'all'}/`}
        as={LinkBase}
        variant={param && param.split('/').length ? 'muted' : 'body'}
      >
        {repos ? 'Repositories' : 'All Sandboxes'} {param && ' / '}
      </Link>
      {param
        ? param.split('/').map((p, i) => (
            <Link
              key={p}
              as={LinkBase}
              to={makeLink(p, repos ? 'repositories' : 'all')}
              variant={i < params ? 'muted' : 'body'}
            >
              {p} {i < params && '/ '}
            </Link>
          ))
        : null}
    </Text>
  );
};
