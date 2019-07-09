import React from 'react';

export const Alias = ({ alias: aliases }) => (
  <span>
    Aliased to{' '}
    {aliases.map(({ alias }) => (
      <a href={`https://${alias}`} rel="noreferrer noopener" target="_blank">
        {alias}
      </a>
    ))}
  </span>
);
