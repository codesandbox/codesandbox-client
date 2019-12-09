import React from 'react';
import { Template } from '../../types/index';
import { OfficialTemplate } from './OfficialTemplate';
import { UserTemplate } from './UserTemplate';

interface ITemplateProps {
  template: Template;
  selectTemplate: (t: Template) => void;
  small: boolean;
}

export default (props: ITemplateProps) =>
  props.template.niceName ? (
    <OfficialTemplate {...props} />
  ) : (
    <UserTemplate {...props} />
  );
