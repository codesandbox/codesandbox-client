import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';
import styled from 'styled-components';
import { useOvermind } from 'app/overmind';
import { Textarea, SidebarRow, Text, FormField } from '@codesandbox/components';
import { PenIcon } from './icons';

const DescriptionTrimmed = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Icon = styled(PenIcon)`
  cursor: pointer;
  display: none;
`;

const SandboxDescription = styled(SidebarRow)<{ empty: boolean }>`
  font-style: ${props => (props.empty ? 'normal' : 'italic')};
  flex-wrap: wrap;
  word-break: break-all;
  :hover {
    svg {
      display: block;
    }
  }
`;

type Props = {
  editable: boolean;
};

export const Description: FunctionComponent<Props> = ({ editable }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: {
      workspace: {
        project: { description },
      },
    },
  } = useOvermind();

  const [editing, setEditing] = useState(false);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === ENTER && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sandboxInfoUpdated();
      setEditing(false);
    }
  };

  const onChange = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    valueChanged({ field: 'description', value });
  };

  return editing ? (
    <FormField
      noPadding
      direction="vertical"
      label="Sandbox Description"
      hideLabel
    >
      <Textarea
        onBlur={() => {
          sandboxInfoUpdated();
          setEditing(false);
        }}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Description"
        maxLength={280}
        ref={el => el && el.focus()}
        rows={2}
        value={description}
      />
    </FormField>
  ) : (
    <SandboxDescription gap={4} empty={Boolean(description)}>
      <DescriptionTrimmed>
        {description || (editable ? 'No description, create one!' : '')}
      </DescriptionTrimmed>
      {editable && <Icon onClick={() => setEditing(true)} />}
    </SandboxDescription>
  );
};
