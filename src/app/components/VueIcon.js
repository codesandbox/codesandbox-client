import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons/IconBase';

const Path = styled.path`
  fill: ${props => props.secondColor};
`;

export default ({ color, secondColor }: { color: string, secondColor: string }) => (
  <IconBase viewBox="0 0 256 221">
    <g>
      <Path color={color} d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" />
      <Path color={color} d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0z" />
      <Path color={secondColor} d="M50.56 0L128 133.12 204.8 0h-47.36L128 51.2 97.92 0H50.56z" />
    </g>
  </IconBase>
);
