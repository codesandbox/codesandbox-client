import React from 'react';
import styled from 'styled-components';

const Count = styled.span`
  color: white;
  font-weight: 500;
`;

const CountDescription = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

type Props = {
  className: string,
  count: number,
  singular: string,
  plural: string,
};

export default ({ className, count, singular, plural }: Props) =>
  <div className={className}>
    <Count>{`${count} `}</Count>
    <CountDescription>
      {` ${count === 1 ? singular : plural}`}
    </CountDescription>
  </div>;
