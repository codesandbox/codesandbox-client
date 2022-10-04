import styled, { css } from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';
import { Button, Select } from '@codesandbox/components';

export const Container = styled.div`
  min-width: 870px;
  max-width: 950px;
  height: 500px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #151515;
  color: #e5e5e5;
  display: flex;
  flex-direction: column;

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

export const HeaderInformation = styled.div`
  flex-grow: 1;
`;

export const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const ModalSidebar = styled.div`
  width: 176px;
  flex-shrink: 0;
  padding: 0px 24px 24px;
  overflow: auto;
`;

export const ModalContent = styled.div`
  flex-grow: 1;
  padding: 0 24px;
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;

  // TODO: Mobile styles
  @media screen and (max-width: 950px) {
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
  border: 1px solid transparent;
  text-align: left;
  padding: 16px;
  border-radius: 2px;
  color: #e5e5e5;
  transition: background ${props => props.theme.speeds[2]} ease-out;
  outline: none;

  &:hover {
    background: #292929;
  }

  &:focus-visible {
    border-color: ${props => props.theme.colors.purple};
  }
`;

export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 10px;
  overflow: auto;
  padding-bottom: 8px;
`;

export const inputStyles = css`
  font-family: inherit;
  height: 32px;
  padding: 8px 16px;
  background-color: #2a2a2a;
  color: #999999;
  border: none;
  border-radius: 2px;
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
  &:hover {
    color: #e5e5e5;
  }
  &:focus {
    color: #e5e5e5;
  }
`;

export const StyledInput = styled.input`
  ${inputStyles}
`;

// Select component places the content with a fixed padding if it has an icon
// !important here will overule that setting since the new select is bigger
export const StyledSelect = styled(Select)`
  ${inputStyles}
  height: 48px;
  padding-left: 44px !important;
`;
