import React from 'react';
import { LayoutDecorator } from '../../../.storybook/decorators';

import { Grid, Column, Row } from '.';

export default {
  title: 'components/Grid',
  component: Grid,
  decorators: [LayoutDecorator],
};

// replace the text inside with Text variants when available
export const Span = () => (
  <Grid>
    <Column span={4}>span 4</Column>
    <Column span={4}>span 4</Column>
    <Column span={4}>span 4</Column>
  </Grid>
);

export const ZeroGap = () => (
  <Grid columnGap={0}>
    <Column span={4}>span 4</Column>
    <Column span={4}>span 4</Column>
    <Column span={4}>span 4</Column>
  </Grid>
);

export const StartAndEnd = () => (
  <Grid>
    <Column start={1} end={4}>
      1 to 4
    </Column>
    <Column start={6} end={7}>
      6-7
    </Column>
    <Column start={9} end={12}>
      9 to 12
    </Column>
  </Grid>
);

export const Mixed = () => (
  <Grid>
    <Column>.</Column>
    <Column span={3}>span 3</Column>
    <Column>.</Column>
    <Column start={7} end={8}>
      7-8
    </Column>
    <Column start={11}>11</Column>
  </Grid>
);

export const Overflow = () => (
  <Grid>
    <Column span={12}>span 12</Column>
    <Column span={6}>span 6</Column>
    <Column span={6}>span 6</Column>
  </Grid>
);

export const ResponsiveSpan = () => (
  <Grid>
    <Column span={[12, 6]}>span [12, 6]</Column>
    <Column span={[12, 6]}>span [12 , 6]</Column>
    <Column span={12}>span 12</Column>
  </Grid>
);

export const ResponsiveStart = () => (
  <Grid>
    <Column start={[1, 1, 2]} span={[12, 6, 4]}>
      one
    </Column>
    <Column start={[1, 7, 8]} span={[12, 6, 4]}>
      two
    </Column>
  </Grid>
);

export const Sidebar = () => (
  <Grid>
    <Column span={[0, 4]}>sidebar</Column>
    <Column span={[12, 8]}>main</Column>
  </Grid>
);

export const WithRow = () => (
  <Grid>
    <Row>header</Row>
    <Row>
      <Column span={[12, 2]}>sidebar</Column>
      <Column span={[12, 10]}>main</Column>
    </Row>
    <Row>
      <Column start={[0, 5]} span={[12, 4]}>
        footer
      </Column>
    </Row>
  </Grid>
);

export const NestedGrid = () => (
  <Grid>
    <Row>header</Row>
    <Column span={[12, 12, 2]}>menu</Column>
    <Column span={[12, 12, 10]}>
      <Grid>
        <Column span={[12, 6, 6]}>left</Column>
        <Column span={[12, 6, 6]}>right</Column>
        <Column span={12}>footer</Column>
      </Grid>
    </Column>
  </Grid>
);

/* eslint-disable react/no-array-index-key */
export const ImageGallery = () => (
  <Grid>
    {new Array(12).fill(true).map((value, index) => (
      <Column
        span={[6, 4, 3]}
        key={index}
        style={{
          height: 150,
          width: '100%',
          backgroundSize: 'cover',
          backgroundImage: `url(https://i.picsum.photos/id/${index +
            100}/200/200.jpg)`,
        }}
      />
    ))}
  </Grid>
);
