import React from 'react';

import { inject, observer } from 'mobx-react';

import 'react-day-picker/lib/style.css';

import Navigation from 'app/pages/common/Navigation';
import SubTitle from 'app/components/SubTitle';
// import Button from 'app/components/Button';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import DelayedAnimation from 'app/components/DelayedAnimation';
import SandboxCard from './SandboxCard';

import { Container, Heading, FancyHeader } from './elements';

class Curator extends React.Component {
  componentDidMount() {
    this.props.signals.explore.pickedSandboxesMounted();
  }

  render() {
    const {
      store: {
        explore: { pickedSandboxes },
      },
    } = this.props;

    return (
      <MaxWidth>
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
              {pickedSandboxes.sandboxes.map((sandbox, index) => (
                <SandboxCard key={sandbox.id} {...sandbox} />
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
