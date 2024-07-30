import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

const overlayStyles = css<{ radius?: number }>`
  &::before {
    // TODO: border-radius;

    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    // TODO: Ideally we have specific radius variants, or a way to inherit border
    // radius from the item wrapping the ::before.
    border-radius: ${({ radius }) => (radius ? `${radius}px` : `initial`)};
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

type AnchorProps = {
  href: string;
  radius?: number;
  css?: Object;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const StyledAnchor = styled.a<
  // Override `as` and other styled component props
  AnchorProps
>`
  // Reset anchor styles
  // The actual styling of the element should happen in the children
  display: flex;
  text-decoration: none;
  color: inherit;
  font-family: inherit;

  ${overlayStyles}
`;

type ButtonProps = {
  radius?: number;
  css?: Object;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button<
  // Override `as` and other styled component props
  ButtonProps
>`
  // Reset button styles
  // The actual styling of the element should happen in the children
  display: flex;
  border: none;
  padding: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  ${overlayStyles}
`;

type ItemProps = {
  children: JSX.Element;
  radius?: number;

  // className from styled function
  className?: never;
};

const StyledItem = styled(
  ({ children, className: styledClassName }: ItemProps) => {
    if (React.Children.count(children) > 1) {
      throw new Error(
        'The StyledOverlay.Item component can only contain one child.'
      );
    }

    const augmentedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        // TODO: fix ts-ignore "Property 'className' does not exist on type 'unknown'."
        // @ts-ignore
        return React.cloneElement(child, { className: styledClassName });
      }

      return child;
    });

    if (augmentedChildren.length > 0) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{augmentedChildren}</>;
    }

    return children;
  }
)<ItemProps>`
  ${overlayStyles}
`;

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
      throw new Error(
        'The InteractiveOverlay component can only contain one child.'
      );
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

      if (augmentedChildren.length > 0) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{augmentedChildren}</>;
      }
    }

    return <div className={styledClassName}>{children}</div>;
  }
)`
  position: relative;

  // Elevate the anchors with href and buttons (except StyledItem) up
  // TODO: Is there an easier way to target just one class instead of having to chain :not?
  & a[href]:not(${StyledItem}):not(${StyledAnchor}),
  button:not(${StyledItem}):not(${StyledButton}) {
    position: relative;
    z-index: 1;
  }
`;

// Wrapper around Wrapper to ensure compound component works. There seems to be an issue
// with extending `styled` component with `.Item` etcetera.
export const InteractiveOverlay = ({
  children,
  isElement,
}: Pick<WrapperProps, 'children' | 'isElement'>) => {
  return <Wrapper isElement={isElement}>{children}</Wrapper>;
};

InteractiveOverlay.Item = StyledItem;
InteractiveOverlay.Button = StyledButton;
InteractiveOverlay.Anchor = StyledAnchor;
