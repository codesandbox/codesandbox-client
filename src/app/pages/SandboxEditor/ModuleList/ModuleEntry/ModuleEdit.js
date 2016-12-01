// @flow
import React from 'react';
import styled from 'styled-components';

import commonStyles from './styles';
import ModuleIcons from './ModuleIcons';
import ModuleTitleInput from './ModuleTitleInput';

const ModuleContainer = styled.span`${props => commonStyles(props)}`;

type Props = {
  isActive: boolean;
  depth: number;
  title: string;
  type: string;
  validateTitle: (name: string) => boolean;
  onCommit: (title: string, force: ?boolean) => void;
  onCancel: () => void;
};

type State = {
  currentTitle: string;
  error: boolean;
};

export default class ModuleEdit extends React.PureComponent {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTitle: props.title,
      error: false,
    };
  }

  onChange = (title: string) => {
    const { validateTitle } = this.props;
    const isError = validateTitle(title);

    this.setState({
      currentTitle: title,
      error: isError,
    });
  };

  onCommit = (force: ?boolean) => {
    const { currentTitle } = this.state;
    this.props.onCommit(currentTitle, force);
  };

  props: Props;
  state: State;

  render() {
    const { isActive, depth, type, onCancel } = this.props;
    const { currentTitle, error } = this.state;
    return (
      <ModuleContainer
        active={isActive}
        depth={depth}
        nameValidationError={error}
        editing
      >
        <ModuleIcons type={type} />
        <ModuleTitleInput
          title={currentTitle}
          onChange={this.onChange}
          onCancel={onCancel}
          onCommit={this.onCommit}
        />
      </ModuleContainer>
    );
  }
}
