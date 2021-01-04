import React, { PureComponent } from 'react';
import { styled } from '../../stitches.config';

const Container = styled('button', {
  display: 'block',
  border: 'none',
  fontSize: 'inherit',
  backgroundColor: 'transparent',
  width: '100%',
  textAlign: 'left',

  paddingLeft: '$4',
  paddingTop: '$1',
  paddingBottom: '$1',
  color: '$neutral100',

  '&:hover': { backgroundColor: '$neutral800' },

  variants: {
    state: {
      active: {
        backgroundColor: '$accent500',
        color: '$neutral1000',

        '&:hover': { backgroundColor: '$accent500' },
      },
    },
  },
});

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  depth: number;
}

export class File extends PureComponent<Props> {
  selectFile = () => {
    if (this.props.selectFile) {
      this.props.selectFile(this.props.path);
    }
  };

  render() {
    const fileName = this.props.path.split('/').filter(Boolean).pop();

    return (
      <Container
        onClick={this.props.selectFile ? this.selectFile : this.props.onClick}
        className={this.props.className}
        state={this.props.active ? 'active' : undefined}
        css={{ paddingLeft: 8 * this.props.depth + 'px' }}
      >
        {fileName}
      </Container>
    );
  }
}
