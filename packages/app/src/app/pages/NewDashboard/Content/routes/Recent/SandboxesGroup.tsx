import React from 'react';
import { Text, Element, Grid, Column } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from '../../../Components/SandboxCard';

export const SandboxesGroup = ({ title, time }) => {
  const {
    state: {
      dashboard: { recentSandboxesByTime, getFilteredSandboxes },
    },
  } = useOvermind();

  return getFilteredSandboxes(recentSandboxesByTime[time]).length ? (
    <Element marginBottom={14}>
      <Text marginBottom={6} block>
        {title}
      </Text>
      <Grid
        rowGap={6}
        columnGap={6}
        marginBottom={8}
        css={css({
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
        })}
      >
        {getFilteredSandboxes(recentSandboxesByTime[time]).map(sandbox => (
          <Column key={sandbox.id}>
            <SandboxCard sandbox={sandbox} />
          </Column>
        ))}
      </Grid>
    </Element>
  ) : null;
};
