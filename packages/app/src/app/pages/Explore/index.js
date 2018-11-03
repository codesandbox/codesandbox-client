import React from 'react';

import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import SubTitle from 'app/components/SubTitle';
import Modal from 'app/components/Modal';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import DelayedAnimation from 'app/components/DelayedAnimation';
import SandboxCard from './SandboxCard';

import {
  Container,
  Heading,
  FancyHeader,
  ModalContainer,
  Iframe,
  NextIconStyled,
  PrevIconStyled,
} from './elements';

class Curator extends React.Component {
  state = {
    modalOpen: false,
    selectedSandbox: {},
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

  getSelectedSandbox = id => {
    const pickedSandboxes = this.props.store.explore.pickedSandboxes;
    return pickedSandboxes.sandboxes.find(s => s.id === id);
  };

  openModal = id => {
    this.setState({
      modalOpen: true,
      selectedSandbox: this.getSelectedSandbox(id),
    });
  };

  getAdjacentSandbox = number => {
    const indexes = this.props.store.explore.pickedSandboxesIndexes;
    const nextSandboxIndex =
      indexes.indexOf(this.state.selectedSandbox.id) + number;

    this.setState({
      modalOpen: true,
      selectedSandbox: this.getSelectedSandbox(indexes[nextSandboxIndex]),
    });
  };

  render() {
    const {
      store: {
        explore: { pickedSandboxes },
      },
    } = this.props;

    const { modalOpen, selectedSandbox } = this.state;

    return (
      <MaxWidth>
        <Modal
          onClose={() => this.setState({ modalOpen: false })}
          isOpen={Boolean(modalOpen)}
          title={selectedSandbox.title}
          width={900}
        >
          <ModalContainer style={{ position: 'relative' }}>
            <PrevIconStyled onClick={() => this.getAdjacentSandbox(-1)} />
            {JSON.stringify(selectedSandbox)}
            <Iframe
              src={`https://codesandbox.dev/embed/${
                selectedSandbox.id
              }?view=preview`}
            />
            <NextIconStyled onClick={() => this.getAdjacentSandbox(1)} />
          </ModalContainer>
        </Modal>
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
