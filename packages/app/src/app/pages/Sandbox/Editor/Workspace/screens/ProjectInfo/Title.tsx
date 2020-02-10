import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { Text, Input, SidebarRow, FormField } from '@codesandbox/components';
import styled from 'styled-components';
import css from '@styled-system/css';
import { PenIcon } from './icons';

const Icon = styled(PenIcon)`
  cursor: pointer;
  opacity: 0;
  transition: all;
  transition-duration: ${({ theme }) => theme.speeds[4]};
`;

const SandboxNameWrapper = styled(SidebarRow)`
  min-height: 0;
  :hover {
    svg {
      opacity: 1;
    }
  }
`;

export const Title = ({ editable }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: {
      editor: { currentSandbox },
      workspace: {
        project: { title },
      },
    },
  } = useOvermind();
  const [editing, setEditing] = useState(false);

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    valueChanged({ field: 'title', value });
  };

  const onKeyUp = ({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
    if (keyCode === ENTER) {
      sandboxInfoUpdated();

      setEditing(false);
    } else if (keyCode === ESC) {
      setEditing(false);
    }
  };

  const onBlur = () => {
    sandboxInfoUpdated();
    setEditing(false);
  };

  const edit = () => {
    valueChanged({
      field: 'title',
      value: getSandboxName(currentSandbox),
    });

    setEditing(true);
  };

  return editing ? (
    <FormField label="Sandbox Name" hideLabel css={css({ paddingX: 0 })}>
      <Input
        onBlur={onBlur}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder="Title"
        ref={(el: any) => el && el.focus()}
        type="text"
        value={title}
      />
    </FormField>
  ) : (
    <SandboxNameWrapper gap={2}>
      <Text maxWidth={190}>{getSandboxName(currentSandbox)}</Text>
      {editable && <Icon onClick={edit} />}
    </SandboxNameWrapper>
  );
};
