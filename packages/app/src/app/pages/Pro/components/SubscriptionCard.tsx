import React from 'react';
import styled from 'styled-components';

import { Feature } from 'app/constants';
import { Text, Stack, Element, Badge } from '@codesandbox/components';

const StyledCard = styled.div<{ isHighlighted?: boolean }>`
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

const StyledSubscriptionLink = styled.a<{
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

interface SubscriptionCardProps {
  title: string;
  children: React.ReactNode;
  features: Feature[];
  cta?: CTABase & CTAOptional;
  isHighlighted?: boolean;
}

export const SubscriptionCard = ({
  title,
  children,
  features,
  cta,
  isHighlighted,
}: SubscriptionCardProps) => {
  return (
    <StyledCard
      isHighlighted={isHighlighted}
      as={Stack}
      gap={9}
      direction="vertical"
    >
      <Text size={16} weight="500">
        {title}
      </Text>
      {children}
      <Stack
        as="ul"
        direction="vertical"
        gap={1}
        // Reset ul styles
        css={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {features.map(feature => (
          <Stack
            key={feature.key}
            as="li"
            justify="space-between"
            align="center"
          >
            <Text css={{ padding: '8px 0' }}>{feature.label}</Text>
            {feature.pill ? (
              <Badge variant="highlight">{feature.pill}</Badge>
            ) : null}
          </Stack>
        ))}
      </Stack>
      {cta ? (
        <StyledSubscriptionLink
          variant={cta.variant}
          {...(cta.href
            ? {
                href: cta.href,
                onClick: cta.onClick,
              }
            : {
                as: 'button',
                onClick: cta.onClick,
              })}
        >
          {cta.isLoading ? 'Loading...' : cta.text}
        </StyledSubscriptionLink>
      ) : (
        <Element css={{ height: '48px' }} />
      )}
    </StyledCard>
  );
};
