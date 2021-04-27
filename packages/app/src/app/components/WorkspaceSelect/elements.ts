import { Stack } from '@codesandbox/components';
import styled from 'styled-components';

const Badge = styled.p`
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.grays[500]};
  color: ${({ theme }) => theme.colors.grays[200]};

  width: ${({ theme }) => theme.sizes[7]}px;
  height: ${({ theme }) => theme.sizes[3]}px;

  text-align: center;
  line-height: 1.4;
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  position: relative;
  top: 1px; // 👌
`;

const MenuItem = styled(Stack)`
  height: 10;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.grays[600]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grays[500]};

  &[data-reach-menu-item][data-component='MenuItem'][data-selected] {
    background-color: ${({ theme }) => theme.colors.grays[500]};
  }

  padding-left: 8;

  &:hover ${Badge} {
    background-color: ${({ theme }) => theme.colors.grays[600]};
  }
`;

export { MenuItem, Badge };
