import React, { FunctionComponent } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';

import { useOvermind } from 'app/overmind';

import { EntryContainer, IconArea, Icon } from '../elements';

import { Link } from './elements';

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

const getName = (resource: string) => {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);

    if (match && match[1]) {
      return match[1];
    }
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
};

type Props = {
  resource: string;
};
export const ExternalResource: FunctionComponent<Props> = ({ resource }) => {
  const {
    actions: {
      workspace: { externalResourceRemoved },
    },
  } = useOvermind();

  return (
    <EntryContainer as="li">
      <Link href={resource}>{getName(resource)}</Link>

      <IconArea>
        <Icon onClick={() => externalResourceRemoved(resource)}>
          <CrossIcon />
        </Icon>
      </IconArea>
    </EntryContainer>
  );
};
