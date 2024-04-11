import { Button, Element, Text, Stack } from '@codesandbox/components';
import styled from 'styled-components';
import {
  GRID_MAX_WIDTH,
  GUTTER,
  ITEM_HEIGHT_GRID,
  ITEM_MIN_WIDTH,
} from '../VariableGrid/constants';

export const StyledDisclaimerWrapper = styled(Element)<{
  insideGrid?: boolean;
}>`
  display: flex;
  flex-direction: ${props => (props.insideGrid ? 'column' : 'row')};
  align-items: ${props => (props.insideGrid ? 'flex-start' : 'center')};
  gap: 0;
`;

export const StyledDisclaimerText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.005em;
  color: #999999;
`;

export const StyledDisclaimerButton = styled(Button)<{ insideGrid?: boolean }>`
  display: flex;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #ebebeb;
  transition: color ease-in 0.3s;
  padding: 4px ${props => (props.insideGrid ? 0 : '8px')};

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    color: #e0e0e0;
  }

  &:focus-visible {
    outline: 2px solid #ac9cff;
    outline-offset: -2px;
  }
`;

export const StyledContentWrapper = styled(Stack)`
  width: 100%;
  max-width: ${GRID_MAX_WIDTH}px;
  padding: 0 ${GUTTER}px 64px;
  overflow: auto;
  scrollbar-gutter: stable;
  margin: 12px auto 0;
  flex-direction: column;
  gap: 48px;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const StyledGrid = styled(Element)`
  display: grid;
  list-style-type: none;
  margin: 0;
  padding: 0;

  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(${ITEM_MIN_WIDTH}px, 1fr));
  grid-auto-rows: minmax(${ITEM_HEIGHT_GRID}px, 1fr);

  @media (width <= 1149px) {
    & li.create-branch:not(:nth-child(-n + 4)) {
      display: none;
    }
  }

  @media (width <= 1425px) {
    & li.create-branch:not(:nth-child(-n + 3)) {
      display: none;
    }
  }

  @media (width <= 1702px) {
    & li.recent-item:not(:nth-child(-n + 12)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 4)) {
      display: none;
    }
  }

  @media (1702px < width <= 1978px) {
    & li.recent-item:not(:nth-child(-n + 15)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 5)) {
      display: none;
    }
  }

  @media (1978px < width <= 2254px) {
    & li.recent-item:not(:nth-child(-n + 18)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 6)) {
      display: none;
    }
  }

  @media (2254px < width <= 2530px) {
    & li.recent-item:not(:nth-child(-n + 14)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 7)) {
      display: none;
    }
  }

  @media (2530px < width <= 2806px) {
    & li.recent-item:not(:nth-child(-n + 16)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 8)) {
      display: none;
    }
  }
`;
