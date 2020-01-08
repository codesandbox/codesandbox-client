import React from 'react';
import styled from 'styled-components';
import { Element } from '../Element';

const H1 = styled(Element).attrs({ as: 'h1' })`
  color: red;
`;

const ExampleComponent = () => <H1>I am an example component</H1>;

export default ExampleComponent;
