import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import {
  Element,
  Textarea,
  SidebarRow,
  Text,
  FormField,
} from '@codesandbox/components';
import { PenIcon } from './icons';

const DescriptionTrimmed = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-wrap: wrap;
  word-break: break-word;
  overflow: hidden;
`;

const Icon = styled(PenIcon)`
  cursor: pointer;
  opacity: 0;
`;

const SandboxDescription = styled(SidebarRow)`
  :hover {
    svg {
      opacity: 1;
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
      direction="vertical"
      label="Sandbox Description"
      hideLabel
      css={css({ paddingX: 0 })}
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
    <SandboxDescription>
      <DescriptionTrimmed>
        {description ||
          (editable ? (
            <Text variant="muted">No description, create one!</Text>
          ) : null)}
        {editable && (
          <Element as="span" marginX={2}>
            <Icon onClick={() => setEditing(true)} />
          </Element>
        )}
      </DescriptionTrimmed>
    </SandboxDescription>
  );
};
