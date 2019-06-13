import * as React from 'react';
import { BasePreview } from '@codesandbox/common/lib/components/Preview/BasePreview';

import { DevToolProps } from '..';

const Browser = (props: DevToolProps) => (
  <BasePreview
    sandboxId={props.sandboxId}
    defaultUrl={`https://${props.sandboxId}.codesandbox.io`}
    isResizing={false}
    title="Test tab"
    hide={props.hidden}
  />
);

export default {
  id: 'codesandbox.dumbbrowser',
  title: 'Browser',
  Content: Browser,
  actions: [],
};
