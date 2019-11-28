import styled from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';

export const Container = styled.div`
  display: flex;
  min-width: 870px;
  max-width: 1200px;
  height: 496px;
  overflow: hidden;
  border: 1px solid #242424;
  border-radius: 4px;
  background-color: #242424;
  color: #fff;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.24);
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;
  background: #242424;
  padding: 1rem 0;
  width: 176px;
  min-width: 176px;
`;

export const Tab = styled(BaseTab)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border: none;
  background: transparent;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  cursor: pointer;

  &[aria-selected='true'],
  :hover {
    background: #151515;
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export const TabContent = styled(TabPanel)`
  display: grid;
  grid-template-rows: min-content auto;
  background: #151515;
  max-height: 496px;
  width: 100%;
  border-left: 1px solid #040404;

  outline: none;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #242424;
  font-size: 19px;
  line-height: 24px;
`;

export const Legend = styled.span`
  color: #757575;
  font-size: 16px;
  line-height: 19px;
`;

export const SubHeader = styled.h2`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin: 1rem 1.5rem;
  margin-top: 24px;
`;

export const Grid = styled.div<{ columnCount: number }>`
  display: grid;
  margin: 0 1.5rem;
  grid-template-columns: repeat(${props => props.columnCount}, 1fr);
  gap: 1rem;
`;
