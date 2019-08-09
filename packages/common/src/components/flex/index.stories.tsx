import * as React from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { storiesOf, RenderFunction } from '@storybook/react';
import {
  withKnobs,
  color,
  boolean,
  number,
  select,
} from '@storybook/addon-knobs';
import Centered from './Centered';
import Fullscreen from './Fullscreen';
import Row from './Row';
import Column from './Column';
import { alignItemsOptions, justifyContentOptions } from './fixtures';
import MaxWidth from './MaxWidth';

const Background = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const withBackground = (fn: RenderFunction) => <Background>{fn()}</Background>;

const makeBorderedContainer = (
  name: string,
  Component: AnyStyledComponent,
  defaultColor: string
) => styled(Component)`
  border: 5px dashed ${() => color(name, defaultColor, 'colors')};
  padding: 10px;
  box-sizing: border-box;
`;

const Content = makeBorderedContainer(
  'content',
  styled.div`
    display: flex;
    overflow: hidden;
    white-space: pre-wrap;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    min-width: 100px;
  `,
  'green'
);

const makeContent = () => {
  const count = number('Repeat content', 1, {}, 'other');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let contents: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    const letter = letters[i % letters.length];
    const repeat = Math.trunc(i / letters.length);
    let label = letter;

    for (let j = 0; j < repeat; j++) {
      label += ` ${letter}`;
    }

    contents.push(<Content>{label}</Content>);
  }

  return <>{contents}</>;
};

const CenteredBordered = makeBorderedContainer('Centered', Centered, 'yellow');

const withCenteredBordered = (fn: RenderFunction) => (
  <CenteredBordered
    horizontal={boolean('horizontal', false, 'Centered Props')}
    vertical={boolean('vertical', false, 'Centered Props')}
  >
    {fn()}
  </CenteredBordered>
);

const FullscreenBordered = makeBorderedContainer(
  'Fullscreen',
  Fullscreen,
  'red'
);

const withFullscreenBordered = (fn: RenderFunction) => (
  <FullscreenBordered>{fn()}</FullscreenBordered>
);

const ColumnBordered = makeBorderedContainer('Column', Column, 'yellow');

const withColumnBordered = (fn: RenderFunction) => (
  <ColumnBordered
    flex={boolean('flex', false, 'Column Props')}
    alignItems={select('alignItems', alignItemsOptions, null, 'Column Props')}
    justifyContent={select(
      'justifyContent',
      justifyContentOptions,
      'space-between',
      'Column Props'
    )}
  >
    {fn()}
  </ColumnBordered>
);

const RowBordered = makeBorderedContainer('Row', Row, 'orange');

const withRowBordered = (fn: RenderFunction) => (
  <RowBordered
    alignItems={select('alignItems', alignItemsOptions, null, 'Row Props')}
    justifyContent={select(
      'justifyContent',
      justifyContentOptions,
      'space-between',
      'Row Props'
    )}
  >
    {fn()}
  </RowBordered>
);

const MaxWidthBordered = makeBorderedContainer(
  'MaxWidth',
  MaxWidth as AnyStyledComponent,
  'blue'
);

const withMaxWidthBordered = (fn: RenderFunction) => (
  <MaxWidthBordered
    responsive={boolean('responsive', undefined, 'MaxWidth props')}
    width={number('width', undefined, {}, 'MaxWidth props')}
  >
    {fn() as JSX.Element}
  </MaxWidthBordered>
);

const stories = storiesOf('components/flex', module)
  .addDecorator(withKnobs)
  .addDecorator(withBackground);

stories.add('Centered', () => withCenteredBordered(makeContent));

stories.add('Fullscreen', () => withFullscreenBordered(makeContent));
stories.add('MaxWidth', () => withMaxWidthBordered(makeContent));

stories.add('Column', () => withColumnBordered(makeContent));

stories.add('Row', () => withRowBordered(makeContent));

const repeat = (name: string, fn: RenderFunction) => () => {
  const times = number(`Repeat ${name}`, 1, {}, 'other');
  const content: JSX.Element[] = [];

  for (let i = 0; i < times; i++) {
    content.push(fn() as JSX.Element);
  }

  return <>{content}</>;
};

stories.add('Fullscreen > Centered', () =>
  withFullscreenBordered(
    repeat('Centered', () => withCenteredBordered(makeContent))
  )
);

stories.add('Fullscreen > Column', () =>
  withFullscreenBordered(
    repeat('Column', () => withColumnBordered(makeContent))
  )
);

stories.add('Fullscreen > Row', () =>
  withFullscreenBordered(repeat('Row', () => withRowBordered(makeContent)))
);

stories.add('MaxWidth > Centered', () =>
  withMaxWidthBordered(
    repeat('Centered', () => withCenteredBordered(makeContent))
  )
);

stories.add('MaxWidth > Column', () =>
  withMaxWidthBordered(repeat('Column', () => withColumnBordered(makeContent)))
);

stories.add('MaxWidth > Row', () =>
  withMaxWidthBordered(repeat('Row', () => withRowBordered(makeContent)))
);
