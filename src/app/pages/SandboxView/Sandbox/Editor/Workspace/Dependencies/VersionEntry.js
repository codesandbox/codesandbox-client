import React from 'react';
import styled from 'styled-components';
import CrossIcon from 'react-icons/lib/md/clear';

import EntryContainer from '../EntryContainer';
import fadeIn from '../../../../../../utils/animation/fade-in';

const Version = styled.div`
  transition: 0.3s ease all;
  position: absolute;
  right: ${props => props.hovering ? 2.5 : 1}rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;

const Icon = styled.div`
  transition: 0.3s ease color;
  position: absolute;
  right: 1rem;
  opacity: 0;
  line-height: 1;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
  ${fadeIn(0)}
  &:hover {
    color: ${props => props.theme.red};
  }
`;

type Props = {
  dependencies: { [key: string]: string },
  dependency: string,
  onRemove: (dep: string) => void,
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
        {hovering && <Icon onClick={this.handleRemove}><CrossIcon /></Icon>}
      </EntryContainer>
    );
  }
}
