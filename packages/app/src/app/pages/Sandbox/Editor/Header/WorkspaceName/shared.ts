import styled from 'styled-components';

const Badge = styled.p`
  border-radius: 2px;

  width: ${({ theme }) => theme.sizes[7]}px;
  height: ${({ theme }) => theme.sizes[3]}px;

  text-align: center;
  line-height: 1.4;
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export { Badge };
