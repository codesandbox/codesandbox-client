// @flow
import React from 'react';

import EditorPreview from './EditorPreview';

type Props = {
  sandbox: Sandbox,
};

export default ({ sandbox }: Props) => <EditorPreview sandbox={sandbox} />;
