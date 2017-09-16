import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { keyframes } from 'styled-components';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import ZeitIntegration from 'app/containers/integrations/Zeit';
import Button from 'app/components/buttons/Button';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';
import ZeitLogo from 'app/components/ZeitLogo';

import delayInEffect from 'app/utils/animation/delay-effect';
import delayOutEffect from 'app/utils/animation/delay-out-effect';

import Cube from './Cube';
import OpaqueLogo from './OpaqueLogo';

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

const ButtonContainer = styled.div`
  margin: 2rem 4rem;
  margin-bottom: 3rem;
  ${delayInEffect()} ${({ deploying }) =>
      deploying && delayOutEffect(0, false)};
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
`;

const DeployAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16px;
  bottom: 10px;
  right: 0;
  left: 0;

  ${({ deploying }) => deploying && delayInEffect(0, false)};
`;

const StyledZeitLogo = styled(ZeitLogo)`
  position: absolute;
  font-size: 4rem;
  transform: translateX(80px);
`;

const cubeAnimation = keyframes`
  0% {
    transform: translateY(10px) translateX(-100px) scale(0, 0);
  }

  20% {
    transform: translateY(10px) translateX(-100px) scale(1, 1);
  }

  80% {
    transform: translateY(10px) translateX(80px) scale(1, 1);
  }

  100% {
    transform: translateY(10px) translateX(80px) scale(1, 1);
  }
`;

const StyledCube = styled(Cube)`
  position: absolute;
  animation: ${cubeAnimation} 2s ease-in infinite;
  animation-delay: ${({ i }) => i * 0.5}s;
  transform: translateY(10px) translateX(-100px) scale(0, 0);
`;

const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  transform: translateY(5px) translateX(-100px);
  z-index: 10;
`;

const DeployText = styled.div`
  ${delayInEffect()};
  margin-bottom: 1rem;
`;

const DeployedLink = styled.a`${delayInEffect(0.25)};`;

const DeploymentManagementNotice = styled.div`
  ${delayInEffect(0.45)};
  font-size: 0.75rem;
  margin-top: 2rem;
`;

type Props = {
  id: string,
  user: CurrentUser,
  userActions: typeof userActionCreators,
  sandboxActions: typeof sandboxActionCreators,
};
type State = {
  deploying: boolean,
  url: ?string,
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});
const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class Deploy extends React.PureComponent<Props, State> {
  state = {
    deploying: false,
    url: null,
  };

  deploy = async () => {
    const { sandboxActions, id } = this.props;

    this.setState({ deploying: true });

    try {
      const url = await sandboxActions.deploy(id);

      this.setState({ deploying: false, url });
    } catch (e) {
      this.setState({ deploying: false });
    }
  };

  render() {
    const { user } = this.props;

    const zeitSignedIn = user.integrations.zeit;
    return (
      <Container>
        <Header>
          <Title>Deployment</Title>
          <PoweredBy>
            Deploy a production version of your sandbox using{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://zeit.co/now"
            >
              ZEIT Now
            </a>
          </PoweredBy>
        </Header>
        <div>
          <Centered horizontal>
            <Margin margin={2}>
              <ZeitIntegration />
            </Margin>
          </Centered>
          <Division />
          <Centered horizontal>
            {!zeitSignedIn && (
              <DisabledOverlay>Sign in to ZEIT to deploy</DisabledOverlay>
            )}

            {this.state.deploying && (
              <Margin top={1}>
                <DeployText>Deploying sandbox...</DeployText>
                <DeployAnimationContainer deploying={this.state.deploying}>
                  <StyledLogo width={70} height={70} />
                  {[0, 1, 2, 3].map(i => (
                    <StyledCube key={i} i={i} size={20} />
                  ))}
                  <StyledZeitLogo />
                </DeployAnimationContainer>
              </Margin>
            )}

            {this.state.url ? (
              <Margin top={1} bottom={1}>
                <Centered horizontal>
                  <DeployText>Deployed!</DeployText>

                  <DeployedLink
                    href={this.state.url}
                    rel="nofollow noreferrer"
                    target="_blank"
                  >
                    {this.state.url}
                  </DeployedLink>

                  <DeploymentManagementNotice>
                    You can manage your deployments{' '}
                    <a
                      href="https://zeit.co/dashboard"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      here
                    </a>.
                  </DeploymentManagementNotice>
                </Centered>
              </Margin>
            ) : (
              <ButtonContainer deploying={this.state.deploying}>
                <Button
                  onClick={this.deploy}
                  disabled={!zeitSignedIn || this.state.deploying}
                >
                  Deploy Now
                </Button>
              </ButtonContainer>
            )}
          </Centered>
        </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deploy);
