import React from 'react';
import styled, { css } from 'styled-components';

import CrossIcon from 'react-icons/lib/md/clear';

const Container = styled.span`
  position: relative;
  color: white;
  font-size: 0.875rem;
  background-color: ${props => props.theme.secondary};
  padding: 0.3em 0.5em;
  border-radius: 4px;
  font-weight: 400;

  ${props => props.canRemove && css`padding-right: 1.5rem;`};
`;

const DeleteIcon = styled(CrossIcon)`
  transition: 0.3s ease all;
  position: absolute;
  right: 0.3rem;
  top: 0;
  bottom: 0;

  margin: auto;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
`;

export default class Tag extends React.PureComponent {
  props: {
    tag: string,
    removeTag: (tag: string) => void,
  };

  removeTag = () => {
    this.props.removeTag(this.props.tag);
  };

  render() {
    const { tag, removeTag } = this.props;
    return (
      <Container canRemove={removeTag}>
        {tag}
        {removeTag && <DeleteIcon onClick={this.removeTag} />}
      </Container>
    );
  }
}
