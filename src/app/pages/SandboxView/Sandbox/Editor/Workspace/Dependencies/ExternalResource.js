import React from 'react';
import styled from 'styled-components';
import theme from 'common/theme';

import CrossIcon from 'react-icons/lib/md/clear';

import EntryContainer from '../EntryContainer';

const Icon = styled.div`
  transition: 0.3s ease color;
  position: absolute;
  right: 1rem;
  line-height: 1;
  color: ${() => theme.background.lighten(2).clearer(0.5)};
  &:hover {
    color: ${() => theme.red};
  }
`;

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

function getName(resource: string) {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    return resource.match(/.*\/(.*)/)[1];
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
}

type Props = {
  resource: string,
  removeResource: (resource: string) => void,
};

export default class ExternalResource extends React.PureComponent {
  props: Props;

  removeResource = () => {
    this.props.removeResource(this.props.resource);
  };

  render() {
    const { resource } = this.props;
    return (
      <EntryContainer>
        <a href={resource} rel="noopener noreferrer" target="_blank">
          {getName(resource)}
        </a>
        <Icon onClick={this.removeResource}><CrossIcon /></Icon>
      </EntryContainer>
    );
  }
}
