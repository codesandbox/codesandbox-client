import { Button } from '@codesandbox/common/lib/components/Button';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import getTime from 'date-fns/get_time';
import subMonths from 'date-fns/sub_months';
import subWeeks from 'date-fns/sub_weeks';
import format from 'date-fns/format';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';

import SubTitle from 'app/components/SubTitle';
import DelayedAnimation from 'app/components/DelayedAnimation';
import Navigation from 'app/pages/common/Navigation';
import { useSignals, useStore } from 'app/store';

import { Container, Buttons, Heading, PickerWrapper } from './elements';
import SandboxCard from './SandboxCard';

const Curator = () => {
  const {
    explore: { pickSandboxModal, popularSandboxesMounted },
  } = useSignals();
  const {
    explore: { popularSandboxes },
  } = useStore();

  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const fetchPopularSandboxes = useCallback(
    date => {
      popularSandboxesMounted(date);
    },
    [popularSandboxesMounted]
  );

  useEffect(() => {
    fetchPopularSandboxes(getTime(subWeeks(new Date(), 1)));
  }, [fetchPopularSandboxes]);

  const pickSandbox = useCallback(
    (id, title, description) => {
      pickSandboxModal({ details: { description, id, title } });
    },
    [pickSandboxModal]
  );

  const handleDayClick = useCallback(
    date => {
      fetchPopularSandboxes(getTime(new Date(date)));

      setSelectedDate(date);
      setShowPicker(false);
    },
    [fetchPopularSandboxes]
  );

  return (
    <MaxWidth>
      <Margin horizontal={1.5} vertical={1.5}>
        <Navigation title="Curator Page" />

        <Heading>Curator Page</Heading>

        <SubTitle>
          Here you can choose the sandboxes that go in the explore page
        </SubTitle>

        <Buttons>
          Most popular sandboxes in the:
          <Button
            onClick={() =>
              fetchPopularSandboxes(getTime(subWeeks(new Date(), 1)))
            }
            small
          >
            Last Week
          </Button>
          <Button
            onClick={() =>
              fetchPopularSandboxes(getTime(subMonths(new Date(), 1)))
            }
            small
          >
            Last Month
          </Button>
          <Button
            onClick={() =>
              fetchPopularSandboxes(getTime(subMonths(new Date(), 6)))
            }
            small
          >
            Last 6 Months
          </Button>
          <Button onClick={() => setShowPicker(show => !show)} small>
            {selectedDate ? format(selectedDate, 'DD/MM/YYYY') : 'Custom'}
          </Button>
          {showPicker ? (
            <PickerWrapper>
              <DayPicker
                onDayClick={handleDayClick}
                selectedDays={selectedDate}
              />
            </PickerWrapper>
          ) : null}
        </Buttons>

        {popularSandboxes ? (
          <Container>
            {popularSandboxes.sandboxes.map(sandbox => (
              <SandboxCard
                key={sandbox.id}
                {...sandbox}
                pickSandbox={pickSandbox}
              />
            ))}
          </Container>
        ) : (
          <DelayedAnimation
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            Fetching Sandboxes...
          </DelayedAnimation>
        )}
      </Margin>
    </MaxWidth>
  );
};

export default observer(Curator);
