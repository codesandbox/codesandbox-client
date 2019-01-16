import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.section`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.4);
  flex: 1;
  height: 250px;
  min-height: 250px;

  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }

  ${({ selected }) =>
    selected &&
    css`
      color: white;

      &:hover {
        color: white;
      }
    `};
`;

const Text = styled.div``;

const Title = styled.h4`
  font-size: 2rem;
  line-height: 1;
  font-weight: 300;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.25rem;
  max-width: 25rem;
  font-weight: 200;
  line-height: 1.4;

  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
`;

const IconContainer = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`;

export default class Step extends React.PureComponent {
  selectStep = () => {
    this.props.selectStep(this.props.i);
  };

  render() {
    const { Icon, description, getY, title, i, selected } = this.props;

    return (
      <Container
        ref={el => {
          if (el) {
            getY(i, el.getBoundingClientRect().top);
          }
        }}
        onClick={this.selectStep}
        selected={selected}
      >
        <IconContainer>
          <Icon />
        </IconContainer>
        <Text>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Text>
      </Container>
    );
  }
}
