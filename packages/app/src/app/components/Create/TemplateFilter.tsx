import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { Badge, Stack } from '@codesandbox/components';
import styled from 'styled-components';

export const TemplateFilter: React.FC<{
  onChange: (selected: string[]) => void;
  additionalTags: string[];
}> = ({ onChange, additionalTags }) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const dynamicTags = [...ALWAYS_TAGS, ...additionalTags]
    .map(humanizeTag) // convert tag to human-readable form
    .filter(item => !selected.includes(item)) // filter out selected tags
    .sort((a, b) => {
      const priorities = ['Server', 'Browser', ...ALWAYS_TAGS];

      const index1 = priorities.indexOf(a);
      const index2 = priorities.indexOf(b);

      /* eslint-disable no-nested-ternary */
      return index1 === -1 ? 1 : index2 === -1 ? -1 : index1 - index2;
    })
    .filter((item, index, arr) => arr.indexOf(item) === index) // filter out duplicates
    .filter((item, _, arr) => {
      // Server/browser should be always together
      if (item === 'Server') {
        return arr.includes('Browser');
      }
      if (item === 'Browser') {
        return arr.includes('Server');
      }

      return true;
    });

  const filters = selected.length > 0 ? dynamicTags : DEFAULT_OPTIONS;

  return (
    <Stack direction="horizontal" gap={0} css={{ gap: 7 }}>
      <Stack direction="horizontal">
        {selected.length > 0 ? (
          <Button
            layout={false}
            onClick={() => setSelected([])}
            css={{
              marginRight: '8px !important',
              width: 28,
              padding: '0 !important',
              svg: {
                margin: 'auto',
              },
            }}
            icon="cross"
          />
        ) : (
          <Button layout={false} data-selected variant="trial">
            Popular
          </Button>
        )}

        <SelectedContainer direction="horizontal">
          {selected.map((option, index, arr) => {
            return (
              <Button
                variant="trial"
                onClick={() =>
                  setSelected(selected.filter(item => item !== option))
                }
                data-selected
                key={option}
                icon={fromOptionToIcon(option)}
                style={{
                  position: 'relative',
                  zIndex: arr.length - index,

                  backgroundColor: purpleColorPalette[800 - index * 100],
                }}
              >
                {option}
              </Button>
            );
          })}
        </SelectedContainer>
      </Stack>

      <Stack css={{ flex: 1, gap: 7 }} gap={0} direction="horizontal">
        {filters.map(option => (
          <Button
            onClick={() => setSelected([...selected, option])}
            key={option}
            icon={fromOptionToIcon(option)}
          >
            {option}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

const purpleColorPalette = {
  800: '#644ED7',
  700: '#7B61FF',
  600: '#9581FF',
  500: '#B0A0FF',
  400: '#CAC0FF',
  300: '#D7D0FF',
  200: '#E5DFFF',
  100: '#F2EFFF',
};

const fromOptionToIcon = (value: typeof DEFAULT_OPTIONS[number]) => {
  switch (value) {
    case 'Server':
      return 'server';
    case 'Browser':
      return 'boxDevbox';
    default:
      return undefined;
  }
};

const ALWAYS_TAGS = ['Workspace'];

const DEFAULT_OPTIONS = [
  'Browser',
  'Server',
  'Frontend',
  'Backend',
  ...ALWAYS_TAGS,
];

function humanizeTag(tag: string) {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('script', 'Script')
    .replace('Http', 'HTTP');
}

const SelectedContainer = styled(Stack)`
  background: ${props => props.theme.colors.purple700};
  border-radius: 99999px;

  > * {
    transition: all 0.2s ease;
  }

  > *:not(:last-child) {
    margin-right: -14px;
  }

  > *:not(:first-child) {
    padding-left: 22px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const Button = styled(({ ...props }) => (
  <Badge as={motion.button} layout textSize={13} iconSize={15} {...props} />
))`
  height: 28px;
  padding: 4px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 0;
  display: inline-flex;
  align-items: center;

  &:not([data-selected]):hover {
    background: #292929;
  }

  &[data-selected]:hover {
    background: #9581ff !important;
  }
`;
