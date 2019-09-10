import React from 'react';
import { Element } from 'react-ui/primitives';
import PlusIcon from 'react-icons/lib/go/plus';

import Row from '../flex/Row';

export const Tabs = props => <Element as={Row} component="Tabs" {...props} />;
export const Tab = props => <Element as="div" component="Tab" {...props} />;
export const Close = props => (
  <Element as={PlusIcon} component="TabCloseIcon" {...props} />
);
