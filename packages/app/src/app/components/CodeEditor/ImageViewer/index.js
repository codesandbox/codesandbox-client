import React from 'react';
import Input from 'app/components/Input';
import Button from 'app/components/Button';
import { Container, Title, SubTitle, Image, MaxWidth } from './elements';

export default class ImageViewer extends React.Component {
  onSubmit = e => {
    e.preventDefault();

    this.props.saveCode();
  };

  changeCode = e => {
    this.props.changeCode(this.props.id, e.target.value);
  };

  render() {
    return (
      <Container horizontal>
        <Title>Image</Title>
        <SubTitle>
          We refer to these files by URL, you can edit this url to change the
          image.
        </SubTitle>

        <Image src={this.props.code} alt={this.props.title} />

        <MaxWidth onSubmit={this.onSubmit}>
          <Input
            innerRef={el => {
              this.input = el;
            }}
            onChange={this.changeCode}
            value={this.props.code}
          />
          <Button disabled={!this.props.isNotSynced} type="submit">
            Save
          </Button>
        </MaxWidth>
      </Container>
    );
  }
}
