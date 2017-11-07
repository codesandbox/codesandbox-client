import React from 'react';
import styled from 'styled-components';

import Centered from 'app/components/flex/Centered';

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

        <img src={this.props.code} alt={this.props.title} />
      </Container>
    );
  }
}
