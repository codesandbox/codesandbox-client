import styled, { css } from 'styled-components';

type ContainerProps = {
  disabled: boolean
}

export const Container = styled.tr`
  margin: 1rem 0;
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);

  ${(props: ContainerProps) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `};
`;

export const Feature = styled.td`
  text-align: right;
  padding: 1rem 0;
  padding-right: 2rem;
`;

type ValueProps = {
  supporter?: boolean
}

export const Value = styled.td`
  text-align: center;
  padding: 0 2rem;
  font-weight: 300;

  ${(props: ValueProps) =>
    props.supporter &&
    css`
      background-color: rgba(0, 0, 0, 0.3);
    `};
`;
