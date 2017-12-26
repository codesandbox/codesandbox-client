import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { EntryContainer, IconArea, Icon } from '../../elements';

import { Version } from './elements';

export default class VersionEntry extends React.PureComponent {
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
