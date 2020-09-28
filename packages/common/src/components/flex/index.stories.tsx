import React from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { color, boolean, number, select } from '@storybook/addon-knobs';
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

const withBackground = (fn: any) => <Background>{fn()}</Background>;

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
  styled.div<{ minWidth: number; minHeight: number }>`
    display: flex;
    overflow: hidden;
    white-space: pre-wrap;
    justify-content: center;
    align-items: center;
    min-height: ${props => props.minHeight}px;
    min-width: ${props => props.minWidth}px;
  `,
  'green'
);

const makeContent = () => {
  const count = number('Repeat content', 1, {}, 'other');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const contents: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    const letter = letters[i % letters.length];
    const repeat = Math.trunc(i / letters.length);
    let label = letter;

    for (let j = 0; j < repeat; j++) {
      label += ` ${letter}`;
    }

    const width = number(`"${label}".minWidth`, 100, {}, 'content sizes');
    const height = number(`"${label}".minHeight`, 100, {}, 'content sizes');

    contents.push(
      <Content minWidth={width} minHeight={height}>
        {label}
      </Content>
    );
  }

  return contents;
};

const CenteredBordered = makeBorderedContainer('Centered', Centered, 'yellow');

const withCenteredBordered = (fn: any) => (
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

const withFullscreenBordered = (fn: any) => (
  <FullscreenBordered>{fn()}</FullscreenBordered>
);

const ColumnBordered = makeBorderedContainer('Column', Column, 'purple');

const withColumnBordered = (fn: any) => (
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

const withRowBordered = (fn: any) => (
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

const withMaxWidthBordered = (fn: any) => (
  <MaxWidthBordered
    responsive={boolean('responsive', undefined, 'MaxWidth props')}
    width={number('width', undefined, {}, 'MaxWidth props')}
  >
    {fn() as JSX.Element}
  </MaxWidthBordered>
);

const repeat = (name: string, fn: any) => () => {
  const times = number(`Repeat ${name}`, 1, {}, 'other');
  const content: JSX.Element[] = [];

  for (let i = 0; i < times; i++) {
    content.push(fn() as JSX.Element);
  }

  return content;
};

storiesOf('components/flex', module)
  .addDecorator(withBackground)
  .add('Centered', () => withCenteredBordered(makeContent))
  .add('Fullscreen', () => withFullscreenBordered(makeContent))
  .add('MaxWidth', () => withMaxWidthBordered(makeContent))
  .add('Column', () => withColumnBordered(makeContent))
  .add('Row', () => withRowBordered(makeContent))
  .add('Fullscreen > Centered', () =>
    withFullscreenBordered(
      repeat('Centered', () => withCenteredBordered(makeContent))
    )
  )
  .add('Fullscreen > Column', () =>
    withFullscreenBordered(
      repeat('Column', () => withColumnBordered(makeContent))
    )
  )
  .add('Fullscreen > Row', () =>
    withFullscreenBordered(repeat('Row', () => withRowBordered(makeContent)))
  )
  .add('MaxWidth > Centered', () =>
    withMaxWidthBordered(
      repeat('Centered', () => withCenteredBordered(makeContent))
    )
  )
  .add('MaxWidth > Column', () =>
    withMaxWidthBordered(
      repeat('Column', () => withColumnBordered(makeContent))
    )
  )
  .add('MaxWidth > Row', () =>
    withMaxWidthBordered(repeat('Row', () => withRowBordered(makeContent)))
  )
  .add('Playground \uD83D\uDE80', () => {
    const decorators = [];
    let current = null;

    do {
      current = select(
        `Component ${decorators.length}`,
        ['Fullscreen', 'MaxWidth', 'Centered', 'Row', 'Column', null],
        null,
        'structure'
      );

      switch (current) {
        case 'Fullscreen':
          decorators.push(withFullscreenBordered);
          break;
        case 'MaxWidth':
          decorators.push(withMaxWidthBordered);
          break;
        case 'Centered':
          decorators.push(withCenteredBordered);
          break;
        case 'Row':
          decorators.push(withRowBordered);
          break;
        case 'Column':
          decorators.push(withColumnBordered);
          break;
      }
    } while (current);

    return decorators.reduceRight(
      (last, decorator, i) => repeat(`Component ${i}`, () => decorator(last)),
      makeContent
    )();
  });
