import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import { useSignals } from 'app/store';
import { EntryContainer, IconArea, Icon } from '../elements';
import { Link } from './elements';

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

const getName = (resource: string) => {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);

    if (match && match[1]) return match[1];
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
};

export const ExternalResource = ({ resource }) => {
  const {
    workspace: { externalResourceRemoved },
  } = useSignals();

  return (
    <EntryContainer>
      <Link href={resource}>{getName(resource)}</Link>
      <IconArea>
        <Icon onClick={() => externalResourceRemoved({ resource })}>
          <CrossIcon />
        </Icon>
      </IconArea>
    </EntryContainer>
  );
};
