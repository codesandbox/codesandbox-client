// @flow
import React from 'react';

import EditorPreview from './EditorPreview';
import FullPreview from './FullPreview';
import type { Tab } from '../../../../../store/reducers/views/sandbox';
import type { Sandbox } from '../../../../../store/entities/sandboxes/index';

type Props = {
  sandbox: Sandbox;
  tab: ?Tab;
  sandbox: ?Sandbox;
};

const VIEW_MAPPING = {
  EditorPreview,
  FullPreview,
};

export default ({ tab, sandbox }: Props) => {
  if (!tab) return null;

  const View = VIEW_MAPPING[tab.view];

  return <View sandbox={sandbox} tab={tab} />;
};
