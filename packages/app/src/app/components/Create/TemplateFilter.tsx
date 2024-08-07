import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { Badge, Stack } from '@codesandbox/components';
import styled from 'styled-components';

const OPTIONS = [
  'Browser',
  'Server',
  'Frontend',
  'Backend',
  'TypeScript',
  'Playground',
];

const EXCLUDE: Record<typeof OPTIONS[number], Array<typeof OPTIONS[number]>> = {
  Browser: ['Server', 'Backend', 'Frontend'],
  Server: ['Browser'],
  Frontend: ['Backend'],
  Backend: ['Frontend', 'TypeScript', 'Browser'],
  TypeScript: ['Backend'],
};

export const TemplateFilter: React.FC<{
  onChange: (selected: string[]) => void;
}> = ({ onChange }) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const optionAfterExcluded = OPTIONS.filter(option => {
    const exclutionCriteria = Object.entries(EXCLUDE).reduce(
      (acc, [key, value]) => {
        if (selected.includes(key)) {
          return [...acc, ...value];
        }

        return acc;
      },
      []
    );

    return !exclutionCriteria.includes(option);
  });

  return (
    <Stack direction="horizontal" gap={2}>
      <Stack direction="horizontal">
        {selected.length > 0 ? (
          <Button
            layout={false}
            onClick={() => setSelected([])}
            css={{
              marginRight: '8px !important',
              width: 26,
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

      <Stack css={{ flex: 1 }} gap={2} direction="horizontal">
        {optionAfterExcluded
          .filter(item => !selected.includes(item))
          .map(option => (
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

const fromOptionToIcon = (value: typeof OPTIONS[number]) => {
  switch (value) {
    case 'Server':
      return 'server';
    case 'Browser':
      return 'boxDevbox';
    default:
      return undefined;
  }
};

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
  height: 26px;
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
