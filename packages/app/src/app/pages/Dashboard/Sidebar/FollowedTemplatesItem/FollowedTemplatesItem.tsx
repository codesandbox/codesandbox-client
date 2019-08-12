import React from 'react';
// @ts-ignore
import TemplateIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/explore.svg';

import Item from '../Item';

interface Props {
  currentPath: string;
  teamId?: string;
}

export const FollowedTemplatesItem = ({ currentPath, teamId }: Props) => {
  const url = teamId
    ? `/dashboard/teams/${teamId}/templates/followed`
    : `/dashboard/templates/followed`;

  return (
    <div>
      <Item
        active={currentPath === url}
        path={url}
        Icon={TemplateIcon}
        name={teamId ? 'Team Followed Templates' : 'Followed Templates'}
      />
    </div>
  );
};
