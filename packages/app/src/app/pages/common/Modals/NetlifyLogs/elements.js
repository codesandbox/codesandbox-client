import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
`;

export const List = styled.ul`
  margin: 0;
  padding: 1.3em;
  list-style: none;
  font-family: 'dm';
  background: #1b1d1f;
  max-height: 400px;
  overflow: auto;
  margin-bottom: 1.3em;
  word-break: break-word;
`;

export const Item = styled.li`
  margin-bottom: 0.4rem;
  line-height: 1.2;

  &:first-child:after {
    display: inline-block;
    animation: ${loading} steps(1, end) 1s infinite;
    content: '';
  }
`;
