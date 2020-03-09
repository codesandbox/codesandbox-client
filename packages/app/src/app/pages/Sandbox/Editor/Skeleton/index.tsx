import Navigator from '@codesandbox/common/lib/components/Preview/Navigator';
import { Collapsible, List, ListItem, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React from 'react';

import {
  SkeletonDevtools,
  SkeletonDevtoolsIframe,
  SkeletonDevtoolsNavigator,
  SkeletonDevtoolsTop,
  SkeletonEditor,
  SkeletonEditorTop,
  SkeletonExplorer,
  SkeletonTextBlock,
  SkeletonWrapper,
} from './elements';

export const ContentSkeleton = ({ style }) => (
  <SkeletonWrapper style={style}>
    <SkeletonExplorer>
      <SkeletonExplorerContents />
    </SkeletonExplorer>
    <SkeletonEditor>
      <SkeletonEditorTop />
    </SkeletonEditor>
    <SkeletonDevtools>
      <SkeletonDevtoolsTop />
      <SkeletonDevtoolsNavigator>
        <Navigator
          url=""
          onChange={() => {}}
          onConfirm={() => {}}
          onRefresh={() => {}}
          isProjectView
        />
      </SkeletonDevtoolsNavigator>
      <SkeletonDevtoolsIframe />
    </SkeletonDevtools>
  </SkeletonWrapper>
);

const SkeletonExplorerContents = () => (
  <>
    <Collapsible title="Files" defaultOpen>
      <List>
        <File type="folder" />
        <File type="folder" />
        <File type="file" nested />
        <File type="file" nested />
        <File type="file" nested />
        <File type="file" />
      </List>
    </Collapsible>
    <Collapsible title="Dependencies" defaultOpen>
      <List css={{ marginBottom: '32px' }}>
        <Dependency />
        <Dependency />
        <Dependency />
      </List>
    </Collapsible>
    <Collapsible title="External resources" />
  </>
);

export const File = props => (
  <ListItem
    justify="space-between"
    align="center"
    css={{
      minHeight: '28px',
      paddingLeft: `calc(${props.nested ? 2 : 1}rem - 2px)`,
    }}
    {...props}
  >
    <Stack gap={2} align="center" css={css({ color: 'sideBar.border' })}>
      <span style={{ opacity: 0.5 }}>{icons[props.type]}</span>{' '}
      <SkeletonTextBlock />
    </Stack>
  </ListItem>
);

const Dependency = () => (
  <ListItem justify="space-between">
    <SkeletonTextBlock />
  </ListItem>
);

const icons = {
  folder: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.86667 2L8.33333 3.46667H14.2C15 3.46667 15.6667 4.13333 15.6667 4.93333V12.4C15.6667 13.2 15 13.8667 14.2 13.8667H2.46667C1.66667 14 1 13.3333 1 12.5333V3.46667C1 2.66667 1.66667 2 2.46667 2H6.86667Z"
        fill="currentColor"
      />
    </svg>
  ),
  file: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  ),
};
