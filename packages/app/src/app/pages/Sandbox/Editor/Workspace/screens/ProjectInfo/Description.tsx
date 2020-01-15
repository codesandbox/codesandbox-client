import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';
import styled from 'styled-components';

import { useOvermind } from 'app/overmind';

import { Textarea, Stack } from '@codesandbox/components';
import { PenIcon } from './icons';

const Icon = styled(PenIcon)`
  cursor: pointer;
  display: none;
`;

const Name = styled(Stack)<{ empty: boolean }>`
  font-style: ${props => (props.empty ? 'normal' : 'italic')};
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

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      sandboxInfoUpdated();

      setEditing(false);
    }
  };

  return editing ? (
    <Textarea
      onBlur={() => {
        sandboxInfoUpdated();

        setEditing(false);
      }}
      onChange={({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
        valueChanged({ field: 'description', value });
      }}
      onKeyDown={onKeyDown}
      placeholder="Description"
      maxLength={280}
      ref={el => {
        if (el) {
          el.focus();
        }
      }}
      rows={2}
      value={description}
    />
  ) : (
    <Name gap={4} empty={Boolean(description)}>
      {description || (editable ? 'No description, create one!' : '')}

      {editable && <Icon onClick={() => setEditing(true)} />}
    </Name>
  );
};
