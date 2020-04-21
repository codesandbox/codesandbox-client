import React, { useEffect } from 'react';
import { Element, Text } from '@codesandbox/components';

import css from '@styled-system/css';
import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { useOvermind } from 'app/overmind';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Drafts = () => {
  const {
    actions,
    state: {
      user,
      dashboard: { draftSandboxes, getFilteredSandboxes, loadingPage },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getDrafts();
  }, [actions.dashboard, user]);

  if (loadingPage) {
    return <Text>loading</Text>;
  }

  return (
    <Element>
      <Text marginBottom={4} block>
        Drafts
      </Text>
      <Filters possibleTemplates={getPossibleTemplates(draftSandboxes)} />
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
      >
        {getFilteredSandboxes(draftSandboxes).map(sandbox => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>
    </Element>
  );
};
