import React from 'react';
import { Text, Element, Grid } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Sandbox } from '../../../Components/Sandbox';

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
          <Sandbox key={sandbox.id} sandbox={sandbox} />
        ))}
      </Grid>
    </Element>
  ) : null;
};
