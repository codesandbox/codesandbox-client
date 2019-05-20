import React from 'react';
import { Template } from '../../types/index';
import OfficialTemplate from './OfficialTemplate';
import UserTemplate from './UserTemplate';

type Props = {
  template: Template;
  subtitle: string;
  selectTemplate: (t: Template) => void;
  small: boolean;
};

export default (props: Props) => {
  if (props.template.niceName) {
    return <OfficialTemplate {...props} />;
  }

  return <UserTemplate {...props} />;
};
