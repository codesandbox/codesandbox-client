import React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';

import { EntryContainer, IconArea, Icon } from '../../elements';
import { Link } from '../elements';

interface IExternalResource {
  removeResource: (a: any) => void;
  resource: any;
}

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

function getName(resource: string) {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);

    if (match && match[1]) return match[1];
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
}

export class ExternalResource extends React.PureComponent<IExternalResource> {
  removeResource = () => {
    this.props.removeResource(this.props.resource);
  };

  render() {
    const { resource } = this.props;
    return (
      <EntryContainer>
        <Link href={resource}>{getName(resource)}</Link>
        <IconArea>
          <Icon onClick={this.removeResource}>
            <CrossIcon />
          </Icon>
        </IconArea>
      </EntryContainer>
    );
  }
}
