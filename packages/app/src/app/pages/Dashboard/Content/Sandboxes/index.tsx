import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { Container, HeaderContainer, HeaderTitle } from '../elements';
import { SandboxGrid } from '../SandboxGrid';
import { DashboardActions } from './Actions';
import { Filters } from './Filters';
import { ITemplate } from './types';

interface IContentProps {
  sandboxes: any[];
  Header: React.ComponentType | string;
  SubHeader?: React.ComponentType;
  ExtraElement: React.ComponentType<IExtraElementProps>;

  possibleTemplates?: ITemplate[];
  isLoading?: boolean;
  hideOrder?: boolean;
  hideFilters?: boolean;
  page?: number | string;
  actions?: any[];
}

export interface IExtraElementProps {
  style: React.CSSProperties;
}

export const Content: React.FC<IContentProps> = ({
  sandboxes,
  Header,
  SubHeader,
  isLoading,
  ExtraElement,
  hideOrder,
  hideFilters,
  possibleTemplates = [],
  page,
  actions: dashboardActions = [],
}) => {
  const { state, actions } = useOvermind();

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>
          {Header}
          {sandboxes && !isLoading && (
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.6',
                marginLeft: '.5rem',
              }}
            >
              {sandboxes.length}
            </span>
          )}
        </HeaderTitle>
        <DashboardActions actions={dashboardActions} />
        <Filters
          hideOrder={hideOrder}
          hideFilters={hideFilters}
          possibleTemplates={possibleTemplates}
        />
      </HeaderContainer>
      {SubHeader}
      {isLoading ? (
        <DelayedAnimation
          delay={0.6}
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          Fetching Sandboxes...
        </DelayedAnimation>
      ) : (
        <SandboxGrid
          page={page}
          ExtraElement={ExtraElement}
          sandboxes={sandboxes}
          selectedSandboxes={state.dashboard.selectedSandboxes}
          orderByField={state.dashboard.orderBy.field}
          isDragging={state.dashboard.isDragging}
          isPatron={state.isPatron}
          sandboxesSelected={actions.dashboard.sandboxesSelected}
          forkExternalSandbox={actions.editor.forkExternalSandbox}
          dragChanged={actions.dashboard.dragChanged}
        />
      )}
    </Container>
  );
};
