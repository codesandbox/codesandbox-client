import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledItem = styled.a`
  // Reset button styles
  // The actual styling of the element should happen in the children
  border: none;
  padding: 0;
  background: transparent;
  display: flex;
  overflow: hidden;

  // Reset anchor and button styles
  // The actual styling of the element should happen in the children
  text-decoration: none;
  color: inherit;
  font-family: inherit;

  &::before {
    // TODO: border-radius;

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
      outline-offset: -2px;
    }
  }

  // Hover styles should be part of the wrapped children
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

export type InteractiveOverlayItemProps = {
  children: React.ReactNode;
} & ItemElementProps;

// TODO rename Item to Trigger?
const Item = ({ children, as, ...restProps }: InteractiveOverlayItemProps) => {
  return (
    <StyledItem as={as} {...restProps}>
      {children}
    </StyledItem>
  );
};

type WrapperProps = {
  children: JSX.Element;
  isElement?: boolean;

  // className from styled function
  className?: never;
};

/**
 * The styled `Wrapper` is used to wrap content inside a clickable (button or anchor) area while ensuring
 * semantic html.
 *
 * Inspired by the Chakra LinkOverlay: https://chakra-ui.com/docs/navigation/link-overlay
 * More information on nested links: https://www.sarasoueidan.com/blog/nested-links
 */
const Wrapper = styled(
  ({
    children,
    isElement = false,
    className: styledClassName,
  }: WrapperProps) => {
    if (React.Children.count(children) > 1) {
      throw new Error('The Wrapper component can only contain one child.');
    }

    if (!isElement) {
      const augmentedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // TODO: fix ts-ignore "Property 'className' does not exist on type 'unknown'."
          // @ts-ignore
          return React.cloneElement(child, { className: styledClassName });
        }

        return child;
      });

      if (augmentedChildren.length) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{augmentedChildren}</>;
      }
    }

    return <div className={styledClassName}>{children}</div>;
  }
)`
  position: relative;

  // Elevate the anchors with href and buttons (except StyledItem) up
  & a[href]:not(${StyledItem}),
  button:not(${StyledItem}) {
    position: relative;
    z-index: 1;
  }
`;

// Wrapper around Wrapper to ensure compound component works. There seems to be an issue
// with extending `styled` component with `.Item`.
export const InteractiveOverlay = ({
  children,
  isElement,
}: Pick<WrapperProps, 'children' | 'isElement'>) => {
  return <Wrapper isElement={isElement}>{children}</Wrapper>;
};

InteractiveOverlay.Item = Item;
