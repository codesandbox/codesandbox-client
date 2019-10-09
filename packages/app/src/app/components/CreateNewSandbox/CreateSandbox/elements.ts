import styled from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 176px minmax(640px, 976px);
  min-width: 870px;
  max-width: 1200px;
  height: 496px;
  border-radius: 0.25rem;
  background-color: #242424;
  color: #fff;
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;
  background: #242424;
  padding: 1rem 0;
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

  svg {
    margin-right: 0.5rem;
  }
`;

export const TabContent = styled(TabPanel)`
  display: flex;
  flex-direction: column;
  background: #151515;
  max-height: 496px;
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
