import 'react-day-picker/lib/style.css';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { useAppState, useActions } from 'app/overmind';
import { Element, Button, ThemeProvider, Text } from '@codesandbox/components';
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
  PickerWrapper,
} from './elements';
import { SandboxCard } from './SandboxCard';

export const Curator: FunctionComponent = withTheme(({ theme }) => {
  const { pickSandboxModal, popularSandboxesMounted } = useActions().explore;
  const { popularSandboxes } = useAppState().explore;
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
    <ThemeProvider theme={theme.vsCode}>
      <Element
        css={css({
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Navigation title="Curator Page" />
        <MaxWidth>
          <Margin horizontal={1.5} vertical={1.5}>
            <Text paddingTop={6} weight="bold" block align="center" size={6}>
              Curator Page
            </Text>

            <Text paddingTop={4} align="center" block size={4}>
              Here you can choose the sandboxes that go in the explore page
            </Text>

            <Buttons>
              Most popular sandboxes in the:
              <Button
                onClick={() =>
                  fetchPopularSandboxes(getTime(subWeeks(new Date(), 1)))
                }
                autoWidth
              >
                Last Week
              </Button>
              <Button
                onClick={() =>
                  fetchPopularSandboxes(getTime(subMonths(new Date(), 1)))
                }
                autoWidth
              >
                Last Month
              </Button>
              <Button
                onClick={() =>
                  fetchPopularSandboxes(getTime(subMonths(new Date(), 6)))
                }
                autoWidth
              >
                Last 6 Months
              </Button>
              <Button onClick={() => setShowPicker(show => !show)} autoWidth>
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
    </ThemeProvider>
  );
});
