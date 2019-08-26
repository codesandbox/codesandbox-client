import React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';

const getFamily = search => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const family = hashes
    .find(hash => hash.split('=')[0] === 'family')
    .split('=')[1];

  return {
    name: family.split('+').join(' '),
    id: family
      .split('+')
      .join('-')
      .toLowerCase(),
  };
};

const ExternalResource = ({ removeResource, resource }) => (
  <EntryContainer>
    <Link id={`font-button-${getFamily(resource).id}`} href={resource}>
      {getFamily(resource).name}
    </Link>
    <IconArea>
      <Icon onClick={() => removeResource(resource)}>
        <CrossIcon />
      </Icon>
    </IconArea>
  </EntryContainer>
);

export default ExternalResource;
