import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Stack, Button } from '@codesandbox/components';
import css from '@styled-system/css';

import { Authorization } from 'app/graphql/types';
import { useAppState, useActions } from 'app/overmind';
import { UserSearchInput } from 'app/components/UserSearchInput';

import { PermissionSelect, MENU_WIDTH } from './PermissionSelect';

export const AddCollaboratorForm = () => {
  const state = useAppState();
  const actions = useActions();

  const controls = useAnimation();
  const [inputValue, setInputValue] = React.useState<string>('');
  const [authorization, setAuthorization] = React.useState<Authorization>(
    Authorization.WriteCode
  );

  const onAuthorizationChanged = (value: string) => {
    setAuthorization(value as Authorization);
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!inputValue || inputValue.trim().length === 0) {
      controls.start({
        translateX: [-4, 4, 0],
        transition: {
          duration: 0.15,
          loop: 3,
        },
      });

      return;
    }

    try {
      setInputValue('');

      if (inputValue.includes('@')) {
        await actions.editor.inviteCollaborator({
          email: inputValue,
          authorization,
          sandboxId: state.editor.currentSandbox!.id,
        });
      } else {
        await actions.editor.addCollaborator({
          username: inputValue,
          authorization,
          sandboxId: state.editor.currentSandbox!.id,
        });
      }
    } catch (e) {
      setInputValue(inputValue);
    }
  };

  return (
    <Stack align="center" onSubmit={onSubmit} as="form" gap={2}>
      <motion.div
        animate={controls}
        css={css({
          position: 'relative',
          width: '100%',
        })}
      >
        <UserSearchInput
          inputValue={inputValue}
          onInputValueChange={val => {
            setInputValue(val);
          }}
          css={css({ paddingRight: MENU_WIDTH })}
        />

        <PermissionSelect
          value={authorization}
          onChange={onAuthorizationChanged}
          css={{
            position: 'absolute',
            top: 0,
            right: 8,
          }}
        />
      </motion.div>

      <Button type="submit" css={css({ width: 'initial' })} marginLeft={1}>
        Send
      </Button>
    </Stack>
  );
};
