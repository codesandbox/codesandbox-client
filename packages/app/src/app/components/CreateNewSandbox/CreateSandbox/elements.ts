import styled, { css } from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';
import { Button } from '@codesandbox/components';

export const Container = styled.div`
  // TODO: Proper height, width and responsive styles
  min-width: 870px;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #151515;
  color: #fff;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.24);

  @media screen and (max-width: 800px) {
    max-width: 100%;
    margin: auto;
    min-width: auto;
    height: 100vh;
    border-radius: 0;

    div[role='tabpanel'] {
      padding-bottom: 40px;
    }
  }
`;

export const ModalLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const HeaderInformation = styled.div`
  flex-grow: 1;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
`;

export const ModalSidebar = styled.div`
  width: 224px;
  flex-shrink: 0;
  padding: 0px 24px 24px;
`;

export const ModalContent = styled.div`
  flex-grow: 1;
  padding: 0 24px;
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;

  // TODO: Mobile styles
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

export const DashboardButton = styled(Button).attrs({
  variant: 'secondary',
})`
  margin-top: 16px;
  justify-content: flex-start;
  height: 32px;
  color: #999999;

  > div {
    width: 24px;
    height: 24px;
  }

  :hover:not(:disabled) {
    background: transparent;
    color: white;
    path {
      fill: white;
    }
  }
`;

export const Tab = styled(BaseTab)`
  text-align: left;
  padding: 8px 0;
  margin-bottom: 4px;

  border: none;
  background: transparent;
  color: #999999;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;

  &[aria-selected='true'],
  :hover {
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
  }
`;

export const TabContent = styled(TabPanel)`
  max-height: 496px;
  width: 100%;
  height: 100%;
  outline: none;

  @media screen and (max-width: 800px) {
    max-height: 100%;
  }
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

  @media screen and (max-width: 800px) {
    display: none;
  }
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

export const MobileTabs = styled.div`
  display: none;
  @media screen and (max-width: 800px) {
    display: flex;
    border: 1px solid #242424;
    z-index: 2147483647;

    button {
      color: #757575;

      &.active {
        color: inherit;
      }
    }
  }
`;

export const TemplateButton = styled.button`
  background: #1d1d1d;
  border: none;
  text-align: left;
  padding: 24px 24px 20px;
  color: #e5e5e5;
`;

export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

export const SelectContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`;

export const inputStyles = css`
  height: 32px;
  padding: 8px 16px;
  background-color: #2a2a2a;
  color: #e5e5e5;
  border: none;
  border-radius: 2px;
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
`;

export const StyledInput = styled.input`
  ${inputStyles}
`;

export const StyledLabel = styled.label`
  color: #999999;
  font-size: 12px;
  line-height: 16px;
`;
