import React from 'react';

import CodeEditor from './CodeEditor';

type Props = {
  id: string,

  changeCode: (id: string, code: string) => Object,
  saveCode: ?() => void,
};

export default (props: Props) => {
  return <CodeEditor {...props} />;
};
