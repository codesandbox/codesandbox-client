import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Element } from '../Element';

const StyledItem = styled(Element)`
  // Reset button styles
  // The actual styling of the element should happen in the children
  border: none;
  padding: 0;
  background: transparent;

  // Reset anchor styles
  // The actual styling of the element should happen in the children
  text-decoration: none;
  color: inherit;

  &::before {
    // todo: border-radius;

    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &:focus-visible {
    outline: none;

    &::before {
      outline: #ac9cff solid 2px;
    }
  }

  // Hover styles should be part of the Overlay children?
`;

/**
 * The `StyledOverlay` is used to wrap content inside a clickable (button or anchor) area while ensuring
 * semantic html.
 *
 * Inspired by the Chakra LinkOverlay: https://chakra-ui.com/docs/navigation/link-overlay
 * More information on nested links: https://www.sarasoueidan.com/blog/nested-links
 */
const StyledOverlay = styled.div`
  position: relative;

  // Elevate the anchors with href and buttons (except StyledItem) up
  & a[href]:not(${StyledItem}),
  button:not(${StyledItem}) {
    position: relative;
    z-index: 1;
  }
`;

type ItemElementProps =
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: 'a';
      href: string;
    })
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      as: 'button';
      href?: never;
    });

type ItemProps = {
  children: React.ReactNode;
} & ItemElementProps;

// TODO rename Item to Trigger?
const Item = ({ children, as, ...restProps }: ItemProps) => {
  return (
    <StyledItem as={as} {...restProps}>
      {children}
    </StyledItem>
  );
};

// TODO: Add property to conditionally render div around children
type OverlayProps = {
  children: JSX.Element;
};

const Overlay = ({ children }: OverlayProps) => {
  if (React.Children.count(children) > 1) {
    throw new Error('The Overlay component can only contain one child.');
  }

  // eslint-disable-next-line consistent-return
  const augmentedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // TODO: fix ts-ignore "Property 'className' does not exist on type 'unknown'.""
      // @ts-ignore
      const newClassName = `${child.props.className} ${StyledOverlay}`;

      // TODO: fix ts-ignore "Property 'className' does not exist on type 'unknown'."
      // @ts-ignore
      return React.cloneElement(child, { className: newClassName });
    }
  });

  if (augmentedChildren) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{augmentedChildren}</>;
  }

  return <StyledOverlay>{children}</StyledOverlay>;
};

// TODO: we might need another prop type because it's a compound / dot notation component?
export const InteractiveOverlay = ({ children }: OverlayProps) => {
  return <Overlay>{children}</Overlay>;
};

InteractiveOverlay.Item = Item;
