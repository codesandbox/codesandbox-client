// @flow
import React from 'react';
import styled from 'styled-components';

import type { Tabs } from '../../../../../store/reducers/views/sandbox';

import ModuleTab from './ModuleTab';
import CustomTab from './CustomTab';

const TabsContainer = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.white};
  font-weight: 200;
  height: 2rem;
`;

type Props = {
  currentTab: ?string;
  tabs: Tabs;
  setTab: (id: string) => void;
  closeTab: (id: string) => void;
};
export default ({ setTab, closeTab, currentTab, tabs }: Props) => (
  <TabsContainer>
    {tabs.map((tab) => {
      if (tab.moduleId) {
        return (
          <ModuleTab
            setTab={setTab}
            closeTab={closeTab}
            key={tab.id}
            id={tab.id}
            moduleId={tab.moduleId}
            active={currentTab === tab.id}
          />
        );
      }

      return (
        <CustomTab
          setTab={setTab}
          closeTab={closeTab}
          active={currentTab === tab.id}
          key={tab.id}
          id={tab.id}
          title={tab.title}
        />
      );
    })}
  </TabsContainer>
);
