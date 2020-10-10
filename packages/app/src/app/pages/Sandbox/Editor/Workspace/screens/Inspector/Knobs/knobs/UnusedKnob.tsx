import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Icon, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { nicifyName } from '../utils/names';

interface UnusedKnobProps {
  propName: string;
  propType: null | string;
  onClick: () => void;
}

export const UnusedKnob = (props: UnusedKnobProps) => {
  const [hovering, setHovering] = React.useState(false);

  return (
    <Stack
      as="button"
      onClick={props.onClick}
      css={css({
        position: 'relative',
        transition: '0.3s ease all',
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
        opacity: 0.6,
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: 'white',
        paddingX: 2,
        paddingY: 2,
        borderRadius: 4,
        margin: 0,
        width: '100%',
        ':hover': {
          opacity: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      })}
      align="center"
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      <Text style={{ width: '100%' }}>{nicifyName(props.propName)}</Text>
      <Text
        css={css({
          transition: '0.3s ease opacity',
          opacity: hovering ? 0 : 1,
        })}
        size={2}
        variant="muted"
      >
        {nicifyName(props.propType || 'unknown')}
      </Text>

      <Icon
        css={css({
          transition: '0.3s ease opacity',
          position: 'absolute',
          right: 2,
          opacity: hovering ? 1 : 0,
        })}
        width={14}
        height={14}
        name="plus"
      />
    </Stack>
  );
};
