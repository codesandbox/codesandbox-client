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
  };

  handleRemove = () => this.props.onRemove(this.props.dependency);
  handleRefresh = () => this.props.onRefresh(this.props.dependency);
  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  render() {
    const { dependencies, dependency } = this.props;
    const { hovering } = this.state;

    return (
      <EntryContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <span>{dependency}</span>
        <Version hovering={hovering}>{dependencies[dependency]}</Version>
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
