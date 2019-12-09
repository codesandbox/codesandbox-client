import React, { FunctionComponent } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';

import { useOvermind } from 'app/overmind';

import { EntryContainer, IconArea, Icon } from '../elements';

import { Link } from './elements';

const getFamily = (search: string) => {
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

type Props = {
  resource: string;
};
export const ExternalFonts: FunctionComponent<Props> = ({ resource }) => {
  const {
    actions: {
      workspace: { externalResourceRemoved },
    },
  } = useOvermind();
  const { id, name } = getFamily(resource);

  return (
    <EntryContainer as="li">
      <Link href={resource} id={`font-button-${id}`}>
        {name}
      </Link>

      <IconArea>
        <Icon
          aria-label="Remove Resource"
          onClick={() => externalResourceRemoved(resource)}
        >
          <CrossIcon />
        </Icon>
      </IconArea>
    </EntryContainer>
  );
};
