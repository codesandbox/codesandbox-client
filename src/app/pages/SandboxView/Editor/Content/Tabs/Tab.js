import React from 'react';
import styled from 'styled-components';
import CrossIcon from 'react-icons/lib/md/clear';

const TabContainer = styled.div`
  position: relative;
  transition: 0.3s ease all;
  display: inline-block;

  box-sizing: border-box;
  height: 100%;

  text-align: center;
  background-color: ${props => props.active && props.theme.background2};
  border-right: 1px solid ${props => props.theme.background2};
  border-radius: 2px;
  font-weight: 400;
  padding: 0.5rem 2rem;
  cursor: pointer;
  color: ${props => (props.active ? 'inherit' : props.theme.white.clearer(0.5))};

  svg {
    margin-right: 0.5rem;
    vertical-align: middle;
  }

  ${props => !props.active && (
    `
    &:hover {
      background-color: ${props.theme.background.darken(0.1)()};
      color: white;

      div {
        visibility: visible;
      }
    }
    `
  )}
`;

const CloseButton = styled.div`
  display: inline-block;
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
  position: absolute;
  right: 0;
  line-height: 1;
  vertical-align: middle;
  z-index: 10;

  &:hover {
    color: ${props => props.theme.red};
  }
`;

type Props = {
  id: string;
  title: string;
  active: ?boolean;
  setTab: (id: string) => void;
  closeTab: (id: string) => void;
};

export default class Tab extends React.Component {
  props: Props;
  setTab = () => this.props.setTab(this.props.id);
  closeTab = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.closeTab(this.props.id);
  };

  render() {
    const { title, active } = this.props;
    return (
      <TabContainer onClick={this.setTab} active={active}>
        {title}
        <CloseButton onClick={this.closeTab} active={active}><CrossIcon /></CloseButton>
      </TabContainer>
    );
  }
}
