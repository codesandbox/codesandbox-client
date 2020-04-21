import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { Element, Text } from '@codesandbox/components';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Templates = () => {
  const {
    actions,
    state: {
      user,
      dashboard: { templateSandboxes, loadingPage, activeTeam },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getTemplateSandboxes();
  }, [actions.dashboard, user, activeTeam]);

  if (loadingPage) {
    return <Element>Loading</Element>;
  }

  return (
    <Element>
      <Text marginBottom={4} block>
        Templates
      </Text>
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
      >
        {templateSandboxes.map(({ sandbox }) => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>
    </Element>
  );
};
