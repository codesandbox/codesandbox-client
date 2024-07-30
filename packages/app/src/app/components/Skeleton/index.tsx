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
  SkeletonStatusBar,
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
    <SkeletonStatusBar />
  </SkeletonWrapper>
);

const SkeletonExplorerContents = () => (
  <>
    <Collapsible title="Files" defaultOpen>
      <List>
        <File />
        <File />
        <File />
        <File />
        <File />
        <File />
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

const File = props => (
  <ListItem
    justify="space-between"
    align="center"
    css={css({ paddingLeft: 3, minHeight: 7 })}
    {...props}
  >
    <Stack gap={2} align="center" css={css({ color: 'sideBar.border' })}>
      <SkeletonTextBlock css={css({ width: 5 })} />
      <SkeletonTextBlock css={{ width: 'calc(200px - 28px)' }} />
    </Stack>
  </ListItem>
);

const Dependency = () => (
  <ListItem justify="space-between">
    <SkeletonTextBlock />
  </ListItem>
);
