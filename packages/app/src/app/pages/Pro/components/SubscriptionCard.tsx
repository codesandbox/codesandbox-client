import React from 'react';
import styled from 'styled-components';

import { Feature } from 'app/constants';
import { Text, Stack, Element, Badge } from '@codesandbox/components';

export const StyledCard = styled.div<{ isHighlighted?: boolean }>`
  width: 320px;
  flex-grow: 0;
  padding: 24px;
  font-size: 13px;

  ${props =>
    props.isHighlighted
      ? `
    background-color: #FFFFFF;
    color: #0E0E0E;
    `
      : `
    background-color: #252525;
    color: #999999;
  `}
`;

const subLinkBackgrounds = {
  highlight: { base: '#0E0E0E', hover: '#252525' },
  dark: { base: '#323232', hover: '#292929' },
  light: { base: '#EBEBEB', hover: '#E0E0E0' },
};

const subLinkColors = {
  highlight: { base: '#FFFFFF', hover: '#FFFFFF' },
  dark: { base: '#FFFFFF', hover: '#F5F5F5' },
  light: { base: '#0E0E0E', hover: '#161616' },
};

export const StyledSubscriptionLink = styled.a<{
  variant: 'highlight' | 'dark' | 'light';
}>`
  padding: 12px 20px;
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  font-family: inherit;
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  border: none;

  ${props => `
      background-color: ${subLinkBackgrounds[props.variant].base};
      color: ${subLinkColors[props.variant].base};
      
      &:hover, &:focus {
        background-color: ${subLinkBackgrounds[props.variant].hover};
        color: ${subLinkColors[props.variant].hover};
      }
    `}

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

interface CTABase {
  text: string;
  variant: 'highlight' | 'dark' | 'light';
  isLoading?: boolean;
}

type CTAOptional =
  | {
      href: string;
      onClick?: () => void;
    }
  | {
      href?: never;
      onClick: () => void;
    };

export type CTA = CTABase & CTAOptional;

type SubscriptionCardProps = {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  features: Feature[];
  isHighlighted?: boolean;
} & (
  | {
      cta?: CTA;
    }
  | { customCta?: React.ReactNode }
);

export const SubscriptionCard = ({
  title,
  subTitle,
  children,
  features,
  isHighlighted,
  ...props
}: SubscriptionCardProps) => {
  return (
    <StyledCard
      isHighlighted={isHighlighted}
      as={Stack}
      gap={9}
      direction="vertical"
    >
      <Stack direction="vertical" gap={1}>
        <Text size={16} weight="500">
          {title}
        </Text>
        <Text size={13}>{subTitle}</Text>
      </Stack>
      {children}
      <Stack
        as="ul"
        direction="vertical"
        gap={1}
        css={{
          // Reset ul styles
          margin: 0,
          padding: 0,
          listStyle: 'none',
          // Fill up space
          flex: 1,
        }}
      >
        {features.map(feature => (
          <Stack
            key={feature.key}
            as="li"
            justify="space-between"
            align="center"
          >
            <Text
              css={{ padding: '8px 0' }}
              weight={feature.highlighted ? '700' : '400'}
            >
              {feature.label}
            </Text>
            {feature.pill ? (
              <Badge variant="highlight">{feature.pill}</Badge>
            ) : null}
          </Stack>
        ))}
      </Stack>
      {
        // eslint-disable-next-line no-nested-ternary
        'cta' in props && typeof props.cta !== 'undefined' ? (
          <StyledSubscriptionLink
            variant={props.cta.variant}
            {...(props.cta.href
              ? {
                  href: props.cta.href,
                  onClick: props.cta.onClick,
                }
              : {
                  as: 'button',
                  onClick: props.cta.onClick,
                  disabled: props.cta.isLoading,
                })}
          >
            {props.cta.isLoading ? 'Loading...' : props.cta.text}
          </StyledSubscriptionLink>
        ) : 'customCta' in props && typeof props.customCta !== 'undefined' ? (
          props.customCta
        ) : (
          <Element css={{ height: '48px' }} />
        )
      }
    </StyledCard>
  );
};
