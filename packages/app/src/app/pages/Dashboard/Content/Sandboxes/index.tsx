import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import { DelayedAnimation } from 'app/components/DelayedAnimation';

import { Container, HeaderContainer, HeaderTitle } from '../elements';
import { SandboxGrid } from '../SandboxGrid';

import { DashboardActions } from './Actions';
import { Filters } from './Filters';

type Props = {
  sandboxes: any[];
  Header: ComponentType;
  SubHeader: ComponentType;
  ExtraElement: ComponentType;

  isLoading?: boolean;
  page?: number;
  actions?: any[];
} & Pick<
  ComponentProps<typeof Filters>,
  'hideFilters' | 'hideOrder' | 'possibleTemplates'
>;
export const Content: FunctionComponent<Props> = ({
  sandboxes,
  Header,
  SubHeader,
  isLoading,
  ExtraElement,
  hideOrder,
  hideFilters,
  possibleTemplates = [],
  page,
  actions = [],
}) => (
  <Container>
    <HeaderContainer>
      <HeaderTitle>
        {Header}{' '}
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

      <DashboardActions actions={actions} />

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
        ExtraElement={ExtraElement}
        page={page}
        sandboxes={sandboxes}
      />
    )}
  </Container>
);
