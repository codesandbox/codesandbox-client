import { TimelineMax } from 'gsap';
import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useMatchMedia } from '../../../../hooks';

const Container = styled.a`
  transition: 0.3s ease all;
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

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }

  ${props => css`
    background-color: ${props.theme.background()};
  `};
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

const Hit = ({ hit: { count, value } }) => {
  const reduceAnimation = useMatchMedia('(prefers-reduced-motion: reduce)');
  const el = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    if (reduceAnimation) return;

    tl.current = new TimelineMax().fromTo(
      el.current,
      0.1,
      { opacity: 0 },
      { opacity: 1 }
    );
  }, [reduceAnimation]);

  useEffect(() => {
    if (reduceAnimation) return;

    tl.current.restart();
  }, [reduceAnimation, value]);

  return (
    <Container
      href={`https://codesandbox.io/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${value}&page=1`}
      ref={el}
      rel="noreferrer noopener"
      target="_blank"
      aria-label={`${value}, ${count} sandboxes`}
    >
      <Title>{value}</Title>

      <Count>{count.toLocaleString('en-US')}</Count>
    </Container>
  );
};

export default Hit;
