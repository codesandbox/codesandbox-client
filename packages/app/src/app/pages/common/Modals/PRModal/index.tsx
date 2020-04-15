import React, { FunctionComponent } from 'react';

import { GitProgress } from 'app/components/GitProgress';
import { useOvermind } from 'app/overmind';
import { Stack, Link, Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const PRModal: FunctionComponent = () => {
  const {
    state: {
      git: { isCreatingPr, pr },
    },
  } = useOvermind();

  return (
    <GitProgress
      message="Forking Repository & Creating PR..."
      result={
        isCreatingPr ? null : (
          <>
            <Text marginBottom={6} size={3} block>
              Done! We{"'"}ll now open the new sandbox of this PR and GitHub in
              3 seconds...
            </Text>

            <Stack justify="flex-end">
              <Link
                css={css({
                  width: 'auto',
                  textDecoration: 'none',
                })}
                href={pr.prURL}
                rel="noreferrer noopener"
                target="_blank"
              >
                Click here if nothing happens.
              </Link>
            </Stack>
          </>
        )
      }
    />
  );
};
