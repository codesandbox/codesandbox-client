import React, { useState } from 'react';
// @ts-ignore
import TemplateIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/template.svg';
import { FollowedTemplatesItem } from './FollowedTemplatesItem';
import { MyTemplateItem } from './MyTemplateItem';
import Item from '../Item';

interface Props {
  currentPath: string;
  teamId?: string;
}

export const TemplateItem = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Item
      noActive
      path={
        props.teamId
          ? `/dashboard/teams/${props.teamId}/templates`
          : `/dashboard/templates`
      }
      Icon={TemplateIcon}
      name="Templates"
      onClick={() => setOpen(!open)}
      openByDefault={open}
    >
      <MyTemplateItem {...props} />
      <FollowedTemplatesItem {...props} />
    </Item>
  );
};
