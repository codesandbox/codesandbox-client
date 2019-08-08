import * as React from 'react';
import styled, { CSSProperties } from 'styled-components';
import { storiesOf, RenderFunction } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  color,
  boolean,
  number,
  select,
  text,
} from '@storybook/addon-knobs';
import Centered from './Centered';
import Fullscreen from './Fullscreen';
import Row from './Row';
import Column from './Column';
import { ThemeDecorator } from '../../stories/decorators';

const Background = styled.div`
  background-color: ${() => color('background', 'darkblue', 'colors')};
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  padding: 10px;
`;

const Content = styled.div`
  background-color: ${() => color('content', 'green', 'colors')};
  height: 100px;
  width: 100px;
`;

const CenteredBordered = styled(Centered)`
  border: 2px solid ${() => color('Centered', 'yellow', 'colors')};
`;

const FullscreenBordered = styled(Fullscreen)`
  border: 2px solid ${() => color('Fullscreen', 'red', 'colors')};
`;

const ColumnBordered = styled(Column)`
  border: 2px solid ${() => color('Column', 'orange', 'colors')};
`;

const withBackground = (fn: RenderFunction) => <Background>{fn()}</Background>;

const stories = storiesOf('components/flex', module)
  .addDecorator(withKnobs)
  .addDecorator(withBackground);

stories.add('Centered', () => (
  <CenteredBordered
    horizontal={boolean('horizontal', false, 'Centered Props')}
    vertical={boolean('vertical', false, 'Centered Props')}
  >
    <Content />
  </CenteredBordered>
));

stories.add('Fullscreen', () => (
  <FullscreenBordered>
    <Content />
  </FullscreenBordered>
));

stories.add('Fullscreen > Centered', () => (
  <FullscreenBordered>
    <CenteredBordered
      horizontal={boolean('horizontal', false, 'Centered Props')}
      vertical={boolean('vertical', false, 'Centered Props')}
    >
      <Content />
    </CenteredBordered>
  </FullscreenBordered>
));

stories.add('Column', () => (
  <ColumnBordered
    flex={boolean('flex', false, 'Column Props')}
    alignItems={select(
      'alignItems',
      ['stretch', 'center', 'start', 'end', null],
      null,
      'Column Props'
    )}
    justifyContent={select(
      'justifyContent',
      [
        'stretch',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
        null,
      ],
      'space-between',
      'Column Props'
    )}
  >
    <Content>Column A</Content>
    <Content>Column B</Content>
  </ColumnBordered>
));
