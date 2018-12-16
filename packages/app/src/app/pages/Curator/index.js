import React from 'react';

import { inject, observer } from 'mobx-react';
import getTime from 'date-fns/get_time';
import subMonths from 'date-fns/sub_months';
import subWeeks from 'date-fns/sub_weeks';
import format from 'date-fns/format';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';

import Navigation from 'app/pages/common/Navigation';
import SubTitle from 'app/components/SubTitle';
import Button from 'app/components/Button';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import SandboxCard from './SandboxCard';

import {
  Container,
  Buttons,
  Heading,
  PickerWrapper,
  Animation,
} from './elements';

class Curator extends React.Component {
  state = { showPicker: false, selectedDate: null };
  componentDidMount() {
    this.getPopularSandboxes(getTime(subWeeks(new Date(), 1)));
  }

  handleDayClick = date => {
    this.getPopularSandboxes(getTime(new Date(date)));
    this.setState({ selectedDate: date, showPicker: false });
  };

  getPopularSandboxes = date =>
    this.props.signals.explore.popularSandboxesMounted({
      date,
    });

  pickSandbox = (id, title, description) => {
    this.props.signals.explore.pickSandboxModal({
      details: {
        id,
        title,
        description,
      },
    });
  };

  render() {
    const {
      store: { explore },
    } = this.props;

    const { showPicker, selectedDate } = this.state;

    return (
      <MaxWidth>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="Curator Page" />
          <Heading>Curator Page</Heading>
          <SubTitle>
            Here you can choose the sandboxes that go in the explore page
          </SubTitle>
          <Buttons>
            Most popular sandboxes in the:
            <Button
              small
              onClick={() =>
                this.getPopularSandboxes(getTime(subWeeks(new Date(), 1)))
              }
            >
              Last Week
            </Button>
            <Button
              small
              onClick={() =>
                this.getPopularSandboxes(getTime(subMonths(new Date(), 1)))
              }
            >
              Last Month
            </Button>
            <Button
              small
              onClick={() =>
                this.getPopularSandboxes(getTime(subMonths(new Date(), 6)))
              }
            >
              Last 6 Months
            </Button>
            <Button
              small
              onClick={() =>
                this.setState(state => ({ showPicker: !state.showPicker }))
              }
            >
              {selectedDate ? format(selectedDate, 'DD/MM/YYYY') : 'Custom'}
            </Button>
            {showPicker ? (
              <PickerWrapper>
                <DayPicker
                  selectedDays={selectedDate}
                  onDayClick={this.handleDayClick}
                />
              </PickerWrapper>
            ) : null}
          </Buttons>

          {explore.popularSandboxes ? (
            <Container>
              {explore.popularSandboxes.sandboxes.map(sandbox => (
                <SandboxCard
                  key={sandbox.id}
                  {...sandbox}
                  pickSandbox={this.pickSandbox}
                />
              ))}
            </Container>
          ) : (
            <Animation>Fetching Sandboxes...</Animation>
          )}
        </Margin>
      </MaxWidth>
    );
  }
}

export default inject('signals', 'store')(observer(Curator));
