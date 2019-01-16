import React from 'react';
import styled, { css } from 'styled-components';

import { TimelineMax } from 'gsap';

const Container = styled.a`
  transition: 0.3s ease all;
  display: block;
  margin-bottom: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  color: white;
  border-radius: 4px;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
  }

  ${props => {
    return css`
      background-color: ${props.theme.background()};
    `;
  }};
`;

const Title = styled.div`
  font-size: 1.125rem;
`;

const Count = styled.div`
  float: right;

  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-size: 1.125rem;
`;

export default class Hit extends React.PureComponent {
  componentDidMount() {
    this.tl = new TimelineMax().fromTo(
      this.el,
      0.1,
      { opacity: 0 },
      { opacity: 1 }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props || nextProps.hit.value !== this.props.hit.value) {
      this.tl.restart();
    }
  }

  render() {
    return (
      <Container
        ref={el => {
          this.el = el;
        }}
        href={`https://codesandbox.io/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${
          this.props.hit.value
        }&page=1`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Title>{this.props.hit.value}</Title>
        <Count>{this.props.hit.count}</Count>
      </Container>
    );
  }
}
