import React, { Fragment } from 'react';

import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import SubTitle from 'app/components/SubTitle';
import Modal from 'app/components/Modal';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import DelayedAnimation from 'app/components/DelayedAnimation';
import SandboxCard from './SandboxCard';
import ShowcasePreview from '../Profile/Showcase/ShowcasePreview';

import {
  Container,
  Heading,
  FancyHeader,
  ModalContainer,
  NextIconStyled,
  PrevIconStyled,
} from './elements';

class Curator extends React.Component {
  state = {
    modalOpen: false,
  };
  componentDidMount = () => {
    window.addEventListener('keyup', this.handleKeyPress);
    this.props.signals.explore.pickedSandboxesMounted();
  };

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress);
  }

  handleKeyPress = e => {
    if (!this.state.modalOpen) return;
    const code = e.which || e.keyCode;
    if (code === 37) {
      this.getAdjacentSandbox(-1);
    } else if (code === 39) {
      this.getAdjacentSandbox(1);
    }
  };

  openModal = async id => {
    await this.props.signals.explore.getSandbox({ id });
    this.setState({
      modalOpen: true,
    });
  };

  getAdjacentSandbox = async number => {
    const indexes = this.props.store.explore.pickedSandboxesIndexes;
    const selectedSandbox = this.props.store.explore.selectedSandbox;
    const nextSandboxIndex = indexes.indexOf(selectedSandbox.id) + number;

    await this.props.signals.explore.getSandbox({
      id: indexes[nextSandboxIndex],
    });
  };

  render() {
    const {
      store: {
        explore: { pickedSandboxes, selectedSandbox },
      },
    } = this.props;

    const { modalOpen } = this.state;

    return (
      <MaxWidth>
        {modalOpen ? (
          <Modal
            onClose={() => this.setState({ modalOpen: false })}
            isOpen={Boolean(modalOpen)}
            title={(selectedSandbox || {}).title}
            width={900}
          >
            <ModalContainer style={{ position: 'relative' }}>
              {selectedSandbox ? (
                <Fragment>
                  <PrevIconStyled onClick={() => this.getAdjacentSandbox(-1)} />

                  <ShowcasePreview
                    sandbox={selectedSandbox}
                    settings={this.props.store.preferences.settings}
                  />
                  <NextIconStyled onClick={() => this.getAdjacentSandbox(1)} />
                  {JSON.stringify(selectedSandbox)}
                </Fragment>
              ) : (
                'loading'
              )}
            </ModalContainer>
          </Modal>
        ) : null}
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="Explore Page" />
          <FancyHeader>
            <Heading>Explore Page</Heading>
            <SubTitle>
              Look at these amazing sandboxes{' '}
              <span
                style={{ color: 'white' }}
                role="img"
                aria-label="amazing sandboxes"
              >
                😍
              </span>
            </SubTitle>
          </FancyHeader>

          {pickedSandboxes ? (
            <Container>
              {pickedSandboxes.sandboxes.map(sandbox => (
                <SandboxCard
                  onClick={() => this.openModal(sandbox.id)}
                  key={sandbox.id}
                  {...sandbox}
                />
              ))}
            </Container>
          ) : (
            <DelayedAnimation
              style={{
                textAlign: 'center',
                marginTop: '2rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              Fetching Sandboxes...
            </DelayedAnimation>
          )}
        </Margin>
      </MaxWidth>
    );
  }
}

export default inject('signals', 'store')(observer(Curator));
