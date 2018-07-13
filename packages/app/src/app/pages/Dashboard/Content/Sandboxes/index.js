import React from 'react';
import DelayedAnimation from 'app/components/DelayedAnimation';

import SandboxGrid from '../SandboxGrid';
import Filters from './Filters';

import { Container, HeaderContainer } from '../elements';

// eslint-disable-next-line react/prefer-stateless-function
class Content extends React.Component {
  render() {
    const {
      sandboxes,
      Header,
      isLoading,
      ExtraElement,
      hideOrder,
      hideFilters,
      possibleTemplates = [],
      page,
    } = this.props;

    return (
      <Container>
        <HeaderContainer>
          <div
            style={{
              display: 'flex',
              verticalAlign: 'middle',
              alignItems: 'center',
            }}
          >
            {Header}{' '}
            {sandboxes &&
              !isLoading && (
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
          </div>
          <Filters
            hideOrder={hideOrder}
            hideFilters={hideFilters}
            possibleTemplates={possibleTemplates}
          />
        </HeaderContainer>
        {isLoading ? (
          <DelayedAnimation
            delay={0.6}
            style={{
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
