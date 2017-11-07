import React from 'react';
import styled from 'styled-components';

import Centered from 'app/components/flex/Centered';
import Input from 'app/components/Input';

const Container = styled(Centered)`
  height: 100%;
  color: rgba(255, 255, 255, 0.9);
`;

const Title = styled.div`
  font-size: 2rem;
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

const StyledInput = styled(Input)`
  max-width: 80%;
  font-size: 1.5rem;
`;

type Props = {
  // id: string,
  code: string,
  title: string,
  // updateCode: Function,
};

export default class ImageViewer extends React.Component<Props> {
  state = {
    changedUrl: '',
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

        <StyledInput value={this.props.code} />
      </Container>
    );
  }
}
