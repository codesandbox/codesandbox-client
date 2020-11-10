import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { ListAction, Switch, Label } from '@codesandbox/components';
import css from '@styled-system/css';

export const AlwaysOn: FunctionComponent = () => {
  const {
    actions: {
      workspace: { sandboxAlwaysOnChanged },
    },
    state: {
      editor: {
        currentSandbox: { alwaysOn },
      },
    },
  } = useOvermind();

  const onChange = () => sandboxAlwaysOnChanged({ alwaysOn: !alwaysOn });

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
