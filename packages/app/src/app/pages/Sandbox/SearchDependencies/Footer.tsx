import React from 'react';
import { Stack, Element, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { CloseIcon } from './icons';

export const AddDependencyModalFooter = ({ onClick }) => {
  const actions = useActions();
  const workspace = useAppState().workspace;

  const numberOfDependencies = Object.keys(workspace.selectedDependencies)
    .length;

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
      gap={2}
    >
      {numberOfDependencies ? (
        <Element
          onClick={() => actions.workspace.toggleShowingSelectedDependencies()}
          as="button"
          css={css({
            borderRadius: 'small',
            width: 26,
            height: 26,
            backgroundColor: workspace.showingSelectedDependencies
              ? 'sideBar.foreground'
              : 'green',
            color: 'sideBar.background',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          })}
        >
          {workspace.showingSelectedDependencies ? (
            <CloseIcon />
          ) : (
            <Text size={2}>{numberOfDependencies} </Text>
          )}
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
