import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Tooltip from 'app/components/Tooltip';
import StarIcon from 'react-icons/lib/go/star';

const Container = styled(Tooltip)`
  margin-left: 0.25rem;
  color: ${props => props.theme.primary()}
`;

export default ({
  subscriptionSince,
  ...props
}: {
  subscriptionSince: string,
}) =>
  <Container
    title={`Patron since ${moment(subscriptionSince).format('MMM YY')}!`}
  >
    <StarIcon {...props} />
  </Container>;
