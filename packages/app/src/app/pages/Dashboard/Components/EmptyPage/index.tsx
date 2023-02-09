import { Element, Stack, Text } from '@codesandbox/components';
import styled from 'styled-components';
import {
  GRID_MAX_WIDTH,
  GUTTER,
  ITEM_HEIGHT_GRID,
  ITEM_MIN_WIDTH,
} from '../VariableGrid/constants';

const StyledWrapper = styled(Stack)`
  overflow: auto;
  width: 100%;
  max-width: ${GRID_MAX_WIDTH}px;
  padding: 0 ${GUTTER}px;
  height: 100%;
  margin: 0 auto;
  padding-bottom: 28px;
  flex-direction: column;
  gap: 40px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const StyledDescription = styled(Text)`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #999999;
`;

const StyledGridWrapper = styled(Stack)`
  flex-direction: column;
  gap: ${GUTTER}px;
`;

const StyledGrid = styled(Element)`
  margin: 0;
  padding: 0;
  display: grid;
  list-style: none;
  gap: ${GUTTER}px;
  grid-template-columns: repeat(auto-fill, minmax(${ITEM_MIN_WIDTH}px, 1fr));
  grid-auto-rows: ${ITEM_HEIGHT_GRID}px;
`;

const StyledGridTitle = styled(Text)`
  margin: 0;
  font-size: 16px;
  line-height: 25px;
  font-weight: 400;
`;

export const EmptyPage = {
  StyledWrapper,
  StyledDescription,
  StyledGridWrapper,
  StyledGrid,
  StyledGridTitle,
};
