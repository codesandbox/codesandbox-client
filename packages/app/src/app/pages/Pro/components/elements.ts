import { Text } from '@codesandbox/components';
import styled from 'styled-components';

export const StyledPricingDetailsText = styled(Text)`
  height: 32px; // Twice the line-height of the Text.
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
