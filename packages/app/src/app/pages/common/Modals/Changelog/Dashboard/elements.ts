import { Button as ButtonBase } from '@codesandbox/common/lib/components/Button';
import styled, { css } from 'styled-components';

export const Button = styled(ButtonBase)`
  margin-top: 1rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

export const Container = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background()};
    padding: 1.5rem;
  `};
`;

export const Date = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  float: right;
  width: 100%;
  text-align: right;
`;

export const Description = styled.p`
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

export const Image = styled.img`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  width: 100%;
`;

export const SubTitle = styled.h2`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
`;

export const Title = styled.h1`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
  text-transform: uppercase;
`;

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 1rem;
`;

export const White = styled.span`
  color: #ffffff;
`;
