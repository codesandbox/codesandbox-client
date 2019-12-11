import { Button } from '@codesandbox/common/lib/components/Button';
import styled from 'styled-components';

export const Container = styled.div`
  margin: 5px 1rem 1rem;
`;

export const CenteredText = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    margin-right: 0.25rem;
    opacity: 0.8;
  }
`;

export const Action = styled(Button).attrs({
  block: true,
})`
  padding: 0.5em 0.7em;
  font-size: 14px;

  &:not(:first-child) {
    margin-top: 1rem;
  }
`;
