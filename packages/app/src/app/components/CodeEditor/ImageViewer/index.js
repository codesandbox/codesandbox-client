// @flow
import React from 'react';
import Input from 'common/components/Input';
import Button from 'app/components/Button';
import { Container, Title, SubTitle, Image, MaxWidth } from './elements';

import type { Props, Editor } from '../types';

export default class ImageViewer extends React.Component<Props>
  implements Editor {
  onSubmit = (e: Event) => {
    e.preventDefault();

    if (this.props.onSave) {
      this.props.onSave(this.input.value);
    }
  };

  input: HTMLInputElement;

  doChangeCode = (e: Event & { target: { value: string } }) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { currentModule, width, height } = this.props;

    return (
      <Container width={width} height={height} horizontal>
        <Title>Image</Title>
        <SubTitle>
          We refer to these files by URL, you can edit this url to change the
          image.
        </SubTitle>

        <Image src={currentModule.code} alt={currentModule.code} />

        <MaxWidth onSubmit={this.onSubmit}>
          <Input
            ref={el => {
              this.input = el;
            }}
            onChange={this.doChangeCode}
            value={currentModule.code}
          />
          <Button disabled={!currentModule.isNotSynced} type="submit">
            Save
          </Button>
        </MaxWidth>
      </Container>
    );
  }
}
