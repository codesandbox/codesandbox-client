import 'react-day-picker/lib/style.css';

import { Button } from '@codesandbox/common/lib/components/Button';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { SubTitle } from 'app/components/SubTitle';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import { format, getTime, subMonths, subWeeks } from 'date-fns';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import DayPicker from 'react-day-picker';

import {
  Buttons,
  Container,
  DelayedAnimation,
  Heading,
  PickerWrapper,
} from './elements';
import { SandboxCard } from './SandboxCard';

export const Curator: FunctionComponent = () => {
  const {
    actions: {
      explore: { pickSandboxModal, popularSandboxesMounted },
    },
    state: {
      explore: { popularSandboxes },
    },
  } = useOvermind();
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
      pickSandboxModal({ description, id, title });
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
    <Element style={{ width: '100vw', height: '100vh' }}>
      <Navigation title="Curator Page" />
      <MaxWidth>
        <Margin horizontal={1.5} vertical={1.5}>
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
              {selectedDate
                ? format(new Date(selectedDate), 'dd/MM/yyyy')
                : 'Custom'}
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
            <DelayedAnimation>Fetching Sandboxes...</DelayedAnimation>
          )}
        </Margin>
      </MaxWidth>
    </Element>
  );
};
