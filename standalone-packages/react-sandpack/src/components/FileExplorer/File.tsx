import * as React from 'react';
import { styled } from '../../stitches.config';

const Container = styled('button', {
  display: 'block',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  textAlign: 'left',

  transition: '0.3s ease all',
  fontFamily: 'sans-serif',
  fontSize: '0.875em',
  padding: '0.3em 0.5em',
  paddingLeft: '1rem',
  color: 'rgb(220, 220, 220)',
  borderLeft: '2px solid transparent',
  cursor: 'pointer',

  '&:hover': { color: 'rgb(255, 255, 255)' },

  variants: {
    state: {
      active: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderLeft: '2px solid #6caedd',
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
}

export class File extends React.PureComponent<Props> {
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
      >
        {fileName}
      </Container>
    );
  }
}
