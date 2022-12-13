import styled from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';
import { Select } from '@codesandbox/components';

export const Container = styled.div`
  height: 500px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #151515;
  color: #e5e5e5;
  display: flex;
  flex-direction: column;
`;

export const HeaderInformation = styled.div`
  flex-grow: 1;
`;

export const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media screen and (max-width: 950px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const ModalSidebar = styled.div`
  width: 176px;
  flex-shrink: 0;
  padding: 0px 24px 24px;
  overflow: auto;

  @media screen and (max-width: 950px) {
    width: auto;
    padding: 8px 8px 0;
  }
`;

export const ModalContent = styled.div`
  flex-grow: 1;
  padding: 0 24px;
  overflow: auto;

  @media screen and (max-width: 950px) {
    padding: 0 16px;
  }
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 950px) {
    flex-direction: row;
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
  font-size: 13px;
  line-height: 16px;
  cursor: pointer;
  white-space: nowrap;

  &[aria-selected='true'],
  :hover {
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
  }

  @media screen and (max-width: 950px) {
    margin-bottom: 0;
    padding: 8px;
  }
`;

export const TabContent = styled(TabPanel)`
  width: 100%;
  height: 100%;
  outline: none;
`;

export const TemplateButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #1d1d1d;
  border: 1px solid transparent;
  text-align: left;
  padding: 24px;
  border-radius: 2px;
  color: #e5e5e5;
  transition: background ${props => props.theme.speeds[2]} ease-out;
  outline: none;

  &:hover:not(:disabled) {
    background: #252525;
  }

  &:focus-visible {
    border-color: ${props => props.theme.colors.purple};
  }

  &:disabled {
    opacity: 0.4;
  }
`;

export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  overflow: auto;
  padding-bottom: 12px;

  @media screen and (max-width: 756px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media screen and (max-width: 485px) {
    grid-template-columns: 1fr;
  }
`;

// Select component places the content with a fixed padding if it has an icon
// !important here will overule that setting since the new select is bigger
export const StyledSelect = styled(Select)`
  height: 48px;
  padding-left: 44px !important;
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
