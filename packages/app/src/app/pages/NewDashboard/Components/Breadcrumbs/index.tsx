import React from 'react';
import { Text, Link } from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';

export const Breadcrumbs = ({ param, repos }) => {
  const makeLink = (p: string, link = 'all') =>
    param && param.split('/').length > 2
      ? `/new-dashboard/${link}/${param
          .split('/')
          .slice(0, -1)
          .map(a => a)}` +
        '/' +
        p
      : `/new-dashboard/${link}/${p}`;
  if (!repos) {
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
                to={makeLink(p, 'repositories')}
                variant={i < param.split('/').length - 1 ? 'muted' : 'body'}
              >
                {p} {i < param.split('/').length - 1 && '/ '}
              </Link>
            ))
          : null}
      </Text>
    );
  }

  return (
    <Text marginBottom={1} block weight="bold" size={5}>
      <Link
        to="/new-dashboard/repositories/"
        as={LinkBase}
        variant={param && param.split('/').length ? 'muted' : 'body'}
      >
        Repositories {param && ' / '}
      </Link>
      {param
        ? param.split('/').map((p, i) => (
            <Link
              key={p}
              as={LinkBase}
              to={makeLink(p, 'repositories')}
              variant={i < param.split('/').length - 1 ? 'muted' : 'body'}
            >
              {p} {i < param.split('/').length - 1 && '/ '}
            </Link>
          ))
        : null}
    </Text>
  );
};
