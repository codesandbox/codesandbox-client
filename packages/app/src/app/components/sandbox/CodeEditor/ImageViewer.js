import React from 'react';
import styled from 'styled-components';

import Centered from 'common/components/flex/Centered';
import Input from 'app/components/Input';
import Button from 'app/components/buttons/Button';

const Container = Centered.extend`
  height: 100%;
  color: rgba(255, 255, 255, 0.9);
  overflow: auto;
`;

const Title = styled.div`
  font-size: 2rem;
  margin-top: 3rem;
  margin: 1rem 0;
`;

const SubTitle = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Image = styled.img`
  margin-top: 2rem;
  margin-bottom: 1rem;

  max-width: 80%;
  max-height: 70%;
`;

const MaxWidth = styled.form`
  display: flex;
  justify-content: centered;
  flex-direction: row;
  width: 80%;

  input {
    flex: 4;
    font-size: 1.5rem;
  }

  button {
    flex: 1;
    margin-left: 1rem;
  }
`;

type Props = {
  id: string,
  code: string,
  title: string,
  isNotSynced: boolean,
  changeCode: (id: string, code: string) => Object,
  saveCode: ?() => void,
};

export default class ImageViewer extends React.Component<Props> {
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
