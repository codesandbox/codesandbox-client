import React from 'react';

import CloseIcon from 'react-icons/lib/md/close';

import { OffsetJustifiedArea, ItemTitle, ItemDate } from '../../elements';

export default class FileItem extends React.Component {
  render() {
    return (
      <OffsetJustifiedArea>
        <ItemTitle>{this.props.name}</ItemTitle>
        <ItemDate>{this.props.date}</ItemDate>
        <CloseIcon color="white" />
      </OffsetJustifiedArea>
    );
  }
}
