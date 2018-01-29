import React from 'react';
import styled from 'styled-components';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';

import EntryContainer from '../EntryContainer';
import { IconArea, Icon } from '../Icon';

const Version = styled.div`
  transition: 0.3s ease all;
  position: absolute;
  right: ${props => (props.hovering ? 3.5 : 1)}rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;

type Props = {
  dependencies: { [key: string]: string },
  dependency: string,
  onRemove: (dep: string) => void,
  onRefresh: (dep: string) => void,
};

type State = {
  hovering: boolean,
};

export default class VersionEntry extends React.PureComponent {
  props: Props;
  state: State;

  state = {
    hovering: false,
    version: null,
  };

  setVersionsForLatestPkg(pkg) {
    const that = this;
    fetch(`/api/v1/dependencies/${pkg}`)
      .then(response => response.json())
      .then(data => that.setState({ version: data.data.version }))
      .catch(err => console.err(err)); // eslint-disable-line no-console
  }

  componentWillMount() {
    if (this.props.dependencies[this.props.dependency] === 'latest') {
      this.setVersionsForLatestPkg(`${this.props.dependency}@latest`);
    }
  }

  handleRemove = () => this.props.onRemove(this.props.dependency);
  handleRefresh = () => this.props.onRefresh(this.props.dependency);
  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  render() {
    const { dependencies, dependency } = this.props;
    const version =
      dependencies[dependency] === 'latest' && this.state.version
        ? `latest (${this.state.version})`
        : dependencies[dependency];
    const { hovering } = this.state;
    return (
      <EntryContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <span>{dependency}</span>
        <Version hovering={hovering}>{version}</Version>
        {hovering && (
          <IconArea>
            <Icon onClick={this.handleRefresh}>
              <RefreshIcon />
            </Icon>
            <Icon onClick={this.handleRemove}>
              <CrossIcon />
            </Icon>
          </IconArea>
        )}
      </EntryContainer>
    );
  }
}
