import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const H1 = styled(Element).attrs({ as: 'h1' })(
  css({
    color: 'reds.500',
    fontSize: 7,
  })
);

const ExampleComponent = () => <H1>I am an example component</H1>;

export default ExampleComponent;
