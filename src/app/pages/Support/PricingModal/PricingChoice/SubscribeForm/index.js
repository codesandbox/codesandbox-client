import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Centered from 'app/components/flex/Centered';
import CardInfo from './CardInfo';

const Notice = styled.p`
  font-size: .875rem;
  text-align: center;
  margin: 2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
`;

type Props = {
  name: ?string,
};

export default ({ name }: Props) =>
  <Centered horizontal>
    <CardInfo name={name} />
    <Notice>
      You will be billed now and on the{' '}
      <strong style={{ color: 'white' }}>{moment().format('Do')}</strong> of
      each month thereafter. You can cancel or change your subscription at any
      time.
    </Notice>
  </Centered>;
