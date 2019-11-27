import styled, { css } from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';

export const Container = styled.div`
  ${({ theme }) => css`
    padding: 1.5rem;
    background-color: ${theme.background()};
  `}
`;

export const Title = styled.h1`
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const PublishDate = styled.span`
  float: right;
  width: 100%;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
`;

export const Banner = styled.img`
  width: 100%;
  border-radius: 2;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Subtitle = styled.h2`
  margin-top: 1rem;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
`;

export const Description = styled.p`
  margin-top: 0.5rem;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.6;
`;
export const Highlight = styled.span`
  color: white;
`;

export const Actions = styled.div`
  display: flex;
`;

export const CloseButton = styled(Button).attrs({
  block: true,
  small: true,
  secondary: true,
})`
  margin-top: 1rem;
  margin-right: 0.25rem;
`;

export const ViewButton = styled(Button).attrs({
  block: true,
  small: true,
})`
  margin-top: 1rem;
  margin-left: 0.25rem;
`;
