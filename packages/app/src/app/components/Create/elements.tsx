import styled, { keyframes } from 'styled-components';
import React, { ReactNode } from 'react';
import { Tab as BaseTab, TabList, TabPanel, TabStateReturn } from 'reakit/Tab';
import { Select } from '@codesandbox/components';

export const Container = styled.div`
  height: 564px;
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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
  padding: 0px 24px;
  overflow: auto;

  @media screen and (max-width: 950px) {
    width: auto;
    padding: 8px 8px 0;
  }
`;

export const ModalContent = styled.div`
  flex-grow: 1;
  padding: 0 16px 0 24px;
  scrollbar-gutter: stable;
  overflow: auto;

  @media screen and (max-width: 950px) {
    padding: 0 16px;
  }
`;

interface PanelProps {
  tab: TabStateReturn;
  id: string;
  children: ReactNode;
}

/**
 * The Panel component handles the conditional rendering of the actual panel content. This is
 * done with render props as per the Reakit docs.
 */
export const Panel = ({ tab, id, children }: PanelProps) => {
  return (
    <TabContent {...tab} stopId={id}>
      {({ hidden, ...rest }) =>
        hidden ? null : <div {...rest}>{children}</div>
      }
    </TabContent>
  );
};

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
  padding: 16px;
  background: #1d1d1d;
  border: 1px solid transparent;
  text-align: left;
  font-family: inherit;
  border-radius: 2px;
  color: #e5e5e5;
  animation: ${fadeIn} 0.15s ease-in;
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

export const UnstyledButtonLink = styled.button`
  appearance: none;
  padding: 0;
  background: transparent;
  color: #e4fc82;
  border: none;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
`;

export const DevboxAlternative = ({
  searchQuery,
  onClick,
}: {
  searchQuery?: string;
  onClick: () => void;
}) => {
  return (
    <>
      Browse more than 3 million community-made templates{' '}
      <a
        onClick={onClick}
        style={{ color: '#E4FC82', textDecoration: 'none' }}
        href={
          searchQuery
            ? `https://codesandbox.io/search?query=${encodeURIComponent(searchQuery)}`
            : 'https://codesandbox.io/search'
        }
        target="_blank"
        rel="noreferrer noopener"
      >
        on our Discover page
      </a>
      .
    </>
  );
};

export const SandboxAlternative = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      Devboxes support many more technologies and frameworks, including
      back-end.
      <UnstyledButtonLink onClick={onClick}>
        Browse Devbox templates
      </UnstyledButtonLink>
    </>
  );
};
