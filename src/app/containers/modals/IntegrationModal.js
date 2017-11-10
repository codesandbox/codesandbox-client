import React from 'react';
import styled from 'styled-components';

import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';
import Relative from 'app/components/Relative';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Title = styled.h1`
  font-weight: 500;
  font-size: 1.25rem;
  color: white;
  margin: 0;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const PoweredBy = styled.h2`
  font-weight: 400;
  font-size: 1rem;
  color: white;
  margin-top: 0 !important;
  margin-bottom: 0;
`;

const Header = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Division = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

const DisabledOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  color: white;
  font-size: 1.25rem;
  z-index: 20;
`;

type Props = {
  signedIn: boolean,
  name: string,
  title: string,
  subtitle: string | React.Component,
  Integration: React.CElement,
  children: React.ReactChildren,
};
type State = {
  deploying: boolean,
  url: ?string,
};

export default class IntegrationModal extends React.Component<Props, State> {
  state = {
    deploying: false,
    url: null,
  };

  render() {
    const {
      title,
      children,
      name,
      subtitle,
      Integration,
      signedIn,
    } = this.props;

    return (
      <Container>
        <Header>
          <Title>{title}</Title>
          <PoweredBy>{subtitle}</PoweredBy>
        </Header>
        <div>
          <Centered horizontal>
            <Margin margin={2}>
              <Integration />
            </Margin>
          </Centered>
          <Division />
          <Relative>
            {!signedIn && (
              <DisabledOverlay>Sign in to {name} to continue</DisabledOverlay>
            )}
            {children}
          </Relative>
        </div>
      </Container>
    );
  }
}
