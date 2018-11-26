import React, { Fragment } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ArrowDropDown from 'react-icons/lib/md/keyboard-arrow-down';
import ArrowDropUp from 'react-icons/lib/md/keyboard-arrow-up';

import Input from 'common/components/Input';
import Button from 'app/components/Button';

import {
  EntryContainer,
  IconArea,
  Icon,
  WorkspaceInputContainer,
} from '../../../elements';
import EnvModal from './EnvModal';

export default class VersionEntry extends React.PureComponent {
  state = {
    hovering: false,
    editing: false,
  };

  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  enableEditing = () => {
    this.setState({ editing: true });
  };
  disableEditing = () => {
    this.setState({ editing: false });
  };

  onSubmit = values => {
    this.setState({ editing: false });

    if (values.name !== this.props.name) {
      // The name changed, we recreate the env var.

      this.props.onDelete(this.props.name);
    }

    this.props.onSubmit(values);
  };

  onDelete = () => {
    this.props.onDelete(this.props.name);
  };

  render() {
    const { hovering } = this.state;
    return this.state.editing || !this.props.value ? (
      <WorkspaceInputContainer>
        <EnvModal
          onCancel={!this.props.value ? undefined : this.disableEditing}
          onSubmit={this.onSubmit}
          name={this.props.name}
          value={this.props.value}
        />
      </WorkspaceInputContainer>
    ) : (
      <EntryContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div>{this.props.name}</div>
        {hovering && (
          <IconArea>
            <Icon>
              <EditIcon onClick={this.enableEditing} />
            </Icon>
            <Icon>
              <CrossIcon onClick={this.onDelete} />
            </Icon>
          </IconArea>
        )}
      </EntryContainer>
    );
  }
}
