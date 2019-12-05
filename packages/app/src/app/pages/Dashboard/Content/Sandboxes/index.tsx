import React from 'react';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { Container, HeaderContainer, HeaderTitle } from '../elements';
import { SandboxGrid } from '../SandboxGrid';
import { Filters } from './Filters';
import { DashboardActions } from './Actions';
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

// eslint-disable-next-line react/prefer-stateless-function
export class Content extends React.Component<IContentProps> {
  render() {
    const {
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
    } = this.props;

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
          <DashboardActions actions={actions} />
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
          />
        )}
      </Container>
    );
  }
}
