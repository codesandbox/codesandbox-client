import styled from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';

export const TemplateTitle = styled.span<{ color: string }>`
  margin-top: 0.25rem;
  color: ${props => props.color};
  display: block;
  font-size: 14px;
`;

export const TemplateDescription = styled.span`
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: block;
  font-size: 14px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
`;

export const Container = styled.div`
  margin: 1rem;
  margin-top: 5px;
`;

export const TemplateButton = styled(Button)`
  font-size: 14px;
  padding: 0.5em 0.7em;
`;
