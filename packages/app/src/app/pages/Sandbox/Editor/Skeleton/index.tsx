import React from 'react';
import Navigator from '@codesandbox/common/lib/components/Preview/Navigator';

import {
  SkeletonDevtools,
  SkeletonDevtoolsIframe,
  SkeletonDevtoolsNavigator,
  SkeletonDevtoolsTop,
  SkeletonEditor,
  SkeletonEditorTop,
  SkeletonExplorer,
  SkeletonExplorerTop,
  SkeletonWrapper,
} from './elements';

export const ContentSkeleton = ({ style, onTransitionEnd }) => {
  React.useEffect(() => {
    // In case we started already with opacity 0
    if (style.opacity === 0) {
      onTransitionEnd();
    }
  }, [onTransitionEnd, style.opacity]); // eslint-disable-line we don't want to check style on purpose

  return (
    <SkeletonWrapper style={style} onTransitionEnd={onTransitionEnd}>
      <SkeletonExplorer>
        <SkeletonExplorerTop />
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
};
