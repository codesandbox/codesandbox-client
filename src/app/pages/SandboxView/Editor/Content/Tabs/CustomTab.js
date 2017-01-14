import React from 'react';

import Tab from './Tab';

type Props = {
  title: string;
};
export default ({ title, ...props }: Props) => (
  <Tab title={title} {...props} />
);
