import React from 'react';

import { TagInput } from '.';

export default {
  title: 'components/TagInput',
  component: TagInput,
};

export const Basic = () => {
  const [tags, setTags] = React.useState(['react', 'svg']);

  return <TagInput value={tags} onChange={setTags} />;
};
