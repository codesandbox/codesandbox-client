import * as React from 'react';

import { TitleContainer } from './elements';

function EntryTitle({ title }) {
  return <TitleContainer title={title}>{title}</TitleContainer>;
}

export default EntryTitle;
