import React from 'react';

const Link = ({ name, url, newTab }) => (
  <li>
    <a
      href={url}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {name}
    </a>
  </li>
);

export default Link;
