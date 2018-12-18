import React from 'react';
import DelayedAnimation from 'app/components/DelayedAnimation';

import SandboxGrid from '../SandboxGrid';
import Filters from './Filters';

import { Container, HeaderContainer, HeaderTitle, Loading } from '../elements';

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
          <HeaderTitle>
            {Header}{' '}
            {sandboxes && !isLoading && <Loading>{sandboxes.length}</Loading>}
          </HeaderTitle>
          <Filters
            hideOrder={hideOrder}
            hideFilters={hideFilters}
            possibleTemplates={possibleTemplates}
          />
        </HeaderContainer>
        {isLoading ? (
          <DelayedAnimation
            delay={0.6}
            css={`
              text-align: center;
              margin-top: 2rem;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.5);
            `}
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
