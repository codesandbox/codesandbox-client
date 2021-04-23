import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ListAction, Switch, Label } from '@codesandbox/components';
import css from '@styled-system/css';

export const AlwaysOn: FunctionComponent = () => {
  const { sandboxAlwaysOnChanged } = useActions().workspace;
  const {
    activeTeamInfo,
    activeWorkspaceAuthorization,
    editor: {
      currentSandbox: { alwaysOn },
    },
  } = useAppState();

  if (
    !activeTeamInfo?.joinedPilotAt ||
    activeWorkspaceAuthorization === 'READ'
  ) {
    return null;
  }

  const onChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    sandboxAlwaysOnChanged({ alwaysOn: !alwaysOn });
  };

  return (
    <ListAction
      justify="space-between"
      onClick={onChange}
      css={css({
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'sideBar.border',
      })}
    >
      <Label htmlFor="always-on">Always On</Label>
      <Switch id="always-on" on={alwaysOn} onChange={onChange} />
    </ListAction>
  );
};
