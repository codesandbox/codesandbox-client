import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Stack, Button, Select } from '@codesandbox/components';
import css from '@styled-system/css';

import { UserSearchInput } from './UserSearchInput';

const SELECT_WIDTH = 85;
export const AddCollaboratorForm = () => {
  const controls = useAnimation();
  const [inputValue, setInputValue] = React.useState<string>('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue || inputValue.trim().length === 0) {
      controls.start({
        translateX: [-4, 4],
        transition: {
          duration: 0.1,
          loop: 3,
        },
      });
    }
  };

  return (
    <Stack onSubmit={onSubmit} as="form" gap={2}>
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
          css={css({ paddingRight: SELECT_WIDTH })}
        />

        <Select
          css={css({
            width: SELECT_WIDTH,
            position: 'absolute',
            right: 0,
            top: 0,
            border: 'none',
            backgroundColor: 'transparent',
          })}
        >
          <option>Can Edit</option>
          {/* <option>Can Comment</option> */}
          <option>Can View</option>
        </Select>
      </motion.div>

      <Button type="submit" css={css({ width: 'initial' })} paddingLeft={1}>
        Send
      </Button>
    </Stack>
  );
};
