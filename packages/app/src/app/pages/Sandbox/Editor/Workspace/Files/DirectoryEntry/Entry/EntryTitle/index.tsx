import * as React from 'react';

import { TitleContainer } from './elements';

type Props = {
  title: string
}

const EntryTitle: React.SFC<Props> = ({ title }) => {
  return <TitleContainer title={title}>{title}</TitleContainer>;
}

export default EntryTitle;
