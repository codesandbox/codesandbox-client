import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { useOvermind } from 'app/overmind';

import { Container, HeaderContainer, HeaderTitle } from '../elements';
import { SandboxGrid } from '../SandboxGrid';

import { DashboardActions } from './Actions';
import { Filters } from './Filters';

type Props = {
  Header: ComponentType | string;
  isLoading?: boolean;
  SubHeader?: ComponentType;
} & Pick<ComponentProps<typeof DashboardActions>, 'actions'> &
  Pick<
    ComponentProps<typeof SandboxGrid>,
    'ExtraElement' | 'page' | 'sandboxes'
  > &
  Pick<
    ComponentProps<typeof Filters>,
    'hideFilters' | 'hideOrder' | 'possibleTemplates'
  >;
export const Content: FunctionComponent<Props> = ({
  actions: dashboardActions,
  ExtraElement,
  Header,
  hideFilters,
  hideOrder,
  isLoading = false,
  page,
  possibleTemplates,
  sandboxes,
  SubHeader,
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
          hideFilters={hideFilters}
          hideOrder={hideOrder}
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
