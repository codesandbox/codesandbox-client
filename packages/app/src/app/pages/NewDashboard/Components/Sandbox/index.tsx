import React from 'react';
import { withRouter } from 'react-router-dom';
import { Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SandboxItem } from '../SandboxItem';
import { SandboxCard } from '../SandboxCard';

export const SandboxComponent = props => {
  const {
    state: { dashboard },
  } = useOvermind();

  if (dashboard.viewMode === 'list' || props.match.path.includes('deleted')) {
    return (
      <Element style={{ gridColumn: '1/-1' }}>
        <SandboxItem {...props} />
      </Element>
    );
  }
  return <SandboxCard {...props} />;
};

export const Sandbox = withRouter(SandboxComponent);
