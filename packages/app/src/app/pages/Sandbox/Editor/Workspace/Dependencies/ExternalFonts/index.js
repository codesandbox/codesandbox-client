import React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';

const getFamily = search => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = hashes.reduce((paramsObj, hash) => {
    const [key, val] = hash.split('=');

    return {
      ...paramsObj,
      [key]: decodeURIComponent(val),
    };
  }, {});

  return params.family.split('+').join(' ');
};

const ExternalResource = ({ removeResource, resource }) => (
  <EntryContainer>
    <Link href={resource}>{getFamily(resource)}</Link>
    <IconArea>
      <Icon onClick={() => removeResource(resource)}>
        <CrossIcon />
      </Icon>
    </IconArea>
  </EntryContainer>
);

export default ExternalResource;
