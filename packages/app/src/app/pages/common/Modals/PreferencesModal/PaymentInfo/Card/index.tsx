import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useAppState } from 'app/overmind';

import {
  AmexIcon,
  BlankIcon,
  DiscoverIcon,
  MasterCardIcon,
  VisaIcon,
} from './Icons';

const Icon: FunctionComponent<{ brand?: string }> = ({ brand }) => {
  const iconsByBrand = {
    'American Express': AmexIcon,
    Discover: DiscoverIcon,
    MasterCard: MasterCardIcon,
    Visa: VisaIcon,
  };
  const IconByBrand = iconsByBrand[brand] || BlankIcon;

  return <IconByBrand />;
};

export const Card: FunctionComponent = () => {
  const { paymentDetails } = useAppState().preferences;
  const { brand, last4, name } = paymentDetails || {};

  return (
    <Stack align="flex-start" paddingY={4}>
      <Element
        css={css({
          svg: {
            height: 16,
            width: 'auto',
          },
        })}
        marginTop={1}
        paddingRight={2}
      >
        <Icon brand={brand} />
      </Element>

      <Element>
        <Element>
          <Text size={3} weight="bold">
            {brand}
          </Text>

          <Text variant="muted"> ending in </Text>

          <Text size={3} weight="bold">
            {last4}
          </Text>
        </Element>

        <Element>
          <Text size={3} weight="bold">
            {name}
          </Text>
        </Element>
      </Element>
    </Stack>
  );
};
