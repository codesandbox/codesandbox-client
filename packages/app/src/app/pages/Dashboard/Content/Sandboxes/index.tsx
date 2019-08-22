import React from 'react';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { Container, HeaderContainer, HeaderTitle } from '../elements';
import SandboxGrid from '../SandboxGrid';
import Filters from './Filters';
import { DashboardActions } from './Actions';
import { ITemplate } from './types';

interface Props {
  sandboxes: any[];
  Header: React.ComponentType;
  SubHeader: React.ComponentType;
  ExtraElement: React.ComponentType;

  possibleTemplates: ITemplate[];
  isLoading?: boolean;
  hideOrder?: boolean;
  hideFilters?: boolean;
  page?: number;
  actions?: any[];
}

// eslint-disable-next-line react/prefer-stateless-function
class Content extends React.Component<Props> {
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

export default Content;
