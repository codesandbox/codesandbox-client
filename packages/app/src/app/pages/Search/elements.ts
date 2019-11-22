import Row from '@codesandbox/common/lib/components/flex/Row';
import styled, { css } from 'styled-components';

import { Title as TitleBase } from 'app/components/Title';

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export const Title = styled(TitleBase)`
  ${({ theme }) => css`
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 36px;
    display: flex;
    color: ${theme.lightText};
    margin-bottom: 16px;
  `};
`;

export const Main = styled(Row)`
  display: grid;
  grid-template-columns: 1fr 340px;
  grid-gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Container = styled.div`
  ${({ theme }) => css`
    background: ${theme.background5};
    width: 100vw;
  `};
`;
