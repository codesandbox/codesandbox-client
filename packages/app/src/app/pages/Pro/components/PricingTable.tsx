import React, { useState } from 'react';
import styled from 'styled-components';
import { Column, Grid, Icon, Stack, Text } from '@codesandbox/components';
import { usePriceCalculation } from '../usePriceCalculation';

export const PricingTable = () => {
  const [billingInterval, setBillingInterval] = useState<'year' | 'month'>(
    'year'
  );

  const oneSeatPrice = usePriceCalculation({ billingInterval, maxSeats: 1 });
  const twoThreeExtraSeatPrice = usePriceCalculation({
    billingInterval,
    maxSeats: 3,
  });
  const extraSeatPrice = usePriceCalculation({
    billingInterval,
    maxSeats: null,
  });

  if (!oneSeatPrice || !twoThreeExtraSeatPrice || !extraSeatPrice) {
    return null;
  }

  return (
    <Stack
      css={{ padding: '32px' }}
      direction="vertical"
      gap={8}
      align="center"
    >
      <Text fontFamily="everett" color="#EDFFA5" size={24} weight="500">
        Explore pricing
      </Text>
      <Stack direction="horizontal" justify="center" gap={2}>
        <StyledButton
          data-selected={billingInterval === 'month'}
          onClick={() => setBillingInterval('month')}
        >
          Monthly
        </StyledButton>
        <StyledButton
          data-selected={billingInterval === 'year'}
          onClick={() => setBillingInterval('year')}
        >
          Annually
        </StyledButton>
      </Stack>
      <Grid
        css={{
          maxWidth: '1200px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <Column span={[3, 3, 3]} />
        <Column span={[3, 3, 3]}>
          <Text fontFamily="everett" color="#808080" size={24} weight="500">
            Free
          </Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Text fontFamily="everett" color="#EDFFA5" size={24} weight="500">
            Pro
          </Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Text fontFamily="everett" color="#AC9CFF" size={24} weight="500">
            Organization
          </Text>
        </Column>

        <Column span={[3, 3, 3]} css={{ justifySelf: 'flex-start' }}>
          <Stack direction="vertical" gap={2}>
            <Text size={24} weight="500" fontFamily="everett">
              1st user
            </Text>
            <Text size={16} color="#808080">
              Price for single users.
            </Text>
          </Stack>
        </Column>
        <Column span={[3, 3, 3]}>
          <Text size={16} color="#808080">
            Free
          </Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Text color="#EDFFA5">{oneSeatPrice} / month</Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Icon color="#AC9CFF" name="cross" />
        </Column>
        <Column span={[3, 3, 3]} css={{ justifySelf: 'flex-start' }}>
          <Stack direction="vertical" gap={2}>
            <Text size={24} weight="500" fontFamily="everett">
              2-3 users
            </Text>
            <Text size={16} color="#808080">
              Price for small teams.
            </Text>
          </Stack>
        </Column>
        <Column span={[3, 3, 3]}>
          <Icon color="#808080" name="cross" />
        </Column>
        <Column span={[3, 3, 3]}>
          <Text color="#EDFFA5">+{twoThreeExtraSeatPrice} / user / month</Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Icon color="#AC9CFF" name="cross" />
        </Column>

        <Column
          span={[3, 3, 3]}
          css={{
            justifySelf: 'flex-start',
          }}
        >
          <Stack direction="vertical" gap={2}>
            <Text size={24} weight="500" fontFamily="everett">
              4+ users
            </Text>
            <Text size={16} color="#808080">
              Seat based pricing for medium to large teams.
            </Text>
          </Stack>
        </Column>
        <Column span={[3, 3, 3]}>
          <Icon color="#808080" name="cross" />
        </Column>
        <Column span={[3, 3, 3]}>
          <Text color="#EDFFA5">{extraSeatPrice} / user / month</Text>
        </Column>
        <Column span={[3, 3, 3]}>
          <Icon color="#AC9CFF" name="cross" />
        </Column>
      </Grid>
    </Stack>
  );
};

const StyledButton = styled.button`
  background: transparent;
  color: #edffa5;
  padding: 8px 20px;
  text-align: center;
  font-size: 16px;
  font-family: everett;
  font-weight: 500;
  border: none;
  border-top: 2px solid transparent;
  cursor: pointer;

  &[data-selected='true'] {
    border-top: 2px solid #edffa5;
  }
`;
