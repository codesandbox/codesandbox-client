import * as React from 'react';

import { TitleContainer } from './elements';

export type Props = {
  title: string;
};

const EntryTitle: React.SFC<Props> = ({ title }) => (
  <TitleContainer title={title}>{title}</TitleContainer>
);

export default EntryTitle;
