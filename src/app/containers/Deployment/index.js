import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { keyframes } from 'styled-components';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import IntegrationModal from 'app/containers/modals/IntegrationModal';
import ZeitIntegration from 'app/containers/integrations/Zeit';
import Button from 'app/components/buttons/Button';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';
import NowLogo from 'app/components/NowLogo';
import OpaqueLogo from 'app/components/OpaqueLogo';

import delayInEffect from 'app/utils/animation/delay-effect';
import delayOutEffect from 'app/utils/animation/delay-out-effect';

import Cube from './Cube';

const ButtonContainer = styled.div`
  margin: 2rem 4rem;
  margin-bottom: 3rem;
  ${delayInEffect()} ${({ deploying }) =>
      deploying && delayOutEffect(0, false)};
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

const StyledNowLogo = styled(NowLogo)`
  position: absolute;
  font-size: 4rem;
  transform: translateY(10px) translateX(80px);
`;

const cubeAnimation = keyframes`
  0% {
    transform: translateY(20px) translateX(-100px) scale(0, 0);
  }

  20% {
    transform: translateY(20px) translateX(-100px) scale(1, 1);
  }

  80% {
    transform: translateY(20px) translateX(80px) scale(1, 1);
  }

  100% {
    transform: translateY(20px) translateX(80px) scale(1, 1);
  }
`;

const StyledCube = styled(Cube)`
  position: absolute;
  animation: ${cubeAnimation} 2s ease-in infinite;
  animation-delay: ${({ i }) => i * 0.5}s;
  transform: translateY(20px) translateX(-100px) scale(0, 0);
`;

const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  transform: translateY(15px) translateX(-100px);
  z-index: 10;
`;

const DeployText = styled.div`
  ${delayInEffect()};
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
`;

const DeployedLink = styled.a`
  ${delayInEffect(0.25)};
  font-size: 1.25rem;
`;

const DeploymentManagementNotice = styled.div`
  ${delayInEffect(0.45)};
  font-size: 0.75rem;
  margin-top: 1rem;
`;

type Props = {
  id: string,
  user: CurrentUser,
  sandboxActions: typeof sandboxActionCreators,
};
type State = {
  deploying: boolean,
  url: ?string,
};

const mapDispatchToProps = dispatch => ({
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
      <IntegrationModal
        name="ZEIT"
        Integration={ZeitIntegration}
        title="Deployment"
        subtitle={
          <div>
            {' '}
            Deploy a production version of your sandbox using{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://zeit.co/now"
            >
              ZEIT Now
            </a>
          </div>
        }
        signedIn={user.integrations.zeit}
      >
        <Centered horizontal>
          {this.state.deploying && (
            <Margin top={1}>
              <DeployText>Deploying sandbox...</DeployText>
              <DeployAnimationContainer deploying={this.state.deploying}>
                <StyledLogo width={70} height={70} />
                {[0, 1, 2, 3].map(i => <StyledCube key={i} i={i} size={20} />)}
                <StyledNowLogo backgroundColor="#24282A" />
              </DeployAnimationContainer>
            </Margin>
          )}

          {this.state.url ? (
            <Margin top={1} bottom={2}>
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
      </IntegrationModal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deploy);
