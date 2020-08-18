import React from 'react';
import { Stack, Element, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';

export const AddDependencyModalFooter = ({ onClick }) => {
  const {
    state: { workspace },
  } = useOvermind();

  const numberOfDependencies = Object.values(
    workspace.selectedDependencies
  ).filter(a => a).length;
  return (
    <Stack
      paddingY={4}
      paddingRight={3}
      as="footer"
      justify="flex-end"
      align="center"
      css={css({
        boxShadow: '0px -4px 8px rgba(0,0,0,0.25)',
        backgroundColor: 'sideBar.background',
        borderWidth: 0,
        borderTopWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'sideBar.border',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
      })}
      gap={4}
    >
      {numberOfDependencies ? (
        <Element
          css={css({
            borderRadius: 'small',
            width: 26,
            height: 26,
            backgroundColor: 'green',
            color: 'sideBar.background',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
          marginRight={2}
        >
          <Text size={2}>{numberOfDependencies}</Text>
        </Element>
      ) : null}
      <Button
        disabled={!numberOfDependencies}
        autoWidth
        onClick={onClick}
        css={css({
          width: 'auto !important',
          flexBasis: 124,
        })}
      >
        Add dependenc
        {numberOfDependencies > 1 ? 'ies' : 'y'}
      </Button>
    </Stack>
  );
};
