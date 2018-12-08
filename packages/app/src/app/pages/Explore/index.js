import React from 'react';

import { inject, observer } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';
import SubTitle from 'app/components/SubTitle';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import DelayedAnimation from 'app/components/DelayedAnimation';
import SandboxCard from './SandboxCard';
import Modal from './Modal/index';

import { Container, Heading, FancyHeader } from './elements';

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

  getData = () => ({
    indexes: this.props.store.explore.pickedSandboxesIndexes,
    selectedSandbox: this.props.store.explore.selectedSandbox,
  });

  handleKeyPress = e => {
    if (!this.state.modalOpen) return;
    const { indexes, selectedSandbox = {} } = this.getData();
    const notFirst = indexes.indexOf(selectedSandbox.id) > 0;
    const notLast = indexes.indexOf(selectedSandbox.id) + 1 < indexes.length;
    const code = e.which || e.keyCode;

    // left arrow pressed
    if (code === 37 && notFirst) {
      this.getAdjacentSandbox(-1);
      // right arrow pressed
    } else if (code === 39 && notLast) {
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
    const { indexes, selectedSandbox } = this.getData();
    const adjacentSandboxIndex = indexes.indexOf(selectedSandbox.id) + number;

    await this.props.signals.explore.getSandbox({
      id: indexes[adjacentSandboxIndex],
    });
  };

  render() {
    const {
      store: {
        explore: { pickedSandboxes, selectedSandbox, pickedSandboxesIndexes },
      },
    } = this.props;

    const { modalOpen } = this.state;

    return (
      <MaxWidth>
        {modalOpen ? (
          <Modal
            className="picked-sandbox-modal"
            onClose={() => this.setState({ modalOpen: false })}
            modalOpen={modalOpen}
            selectedSandbox={selectedSandbox}
            settings={this.props.store.preferences.settings}
            indexes={pickedSandboxesIndexes}
            next={() => this.getAdjacentSandbox(1)}
            prev={() => this.getAdjacentSandbox(-1)}
          />
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
