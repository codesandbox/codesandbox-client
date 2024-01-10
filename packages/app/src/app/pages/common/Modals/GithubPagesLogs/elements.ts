import styled, { keyframes } from 'styled-components';
import { Element } from '@codesandbox/components';

const loading = keyframes`
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
`;

export const Item = styled(Element)`
  &:first-child:after {
    display: inline-block;
    animation: ${loading} steps(1, end) 1s infinite;
    content: '';
  }
`;
