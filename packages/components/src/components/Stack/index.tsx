import React from 'react';
import deepmerge from 'deepmerge';
import { Element, IElementProps } from '../Element';

type StackProps = {
  direction?: 'horizontal' | 'vertical';
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  inline?: boolean;
  gap?: number;
} & React.HTMLAttributes<HTMLDivElement> &
  IElementProps;

export const Stack: React.FC<StackProps> = React.forwardRef<
  HTMLDivElement,
  StackProps
>(function Stack(
  {
    direction = 'horizontal',
    inline = false,
    justify,
    align,
    gap,
    css = {},
    ...props
  }: StackProps,
  ref
) {
  const styles = {
    display: inline ? 'inline-flex' : 'flex',
    justifyContent: justify,
    alignItems: align,
    flexDirection: 'row' as 'row' | 'column' | ('row' | 'column')[],
  };

  if (Array.isArray(direction)) {
    styles.flexDirection = direction.map(d =>
      d === 'vertical' ? 'column' : 'row'
    );
    styles['> * + *'] = direction.map(d => createGap(d, gap));
  } else {
    styles.flexDirection = direction === 'vertical' ? 'column' : 'row';
    styles['> * + *'] = createGap(direction, gap);
  }

  return <Element as="div" ref={ref} css={deepmerge(styles, css)} {...props} />;
});

const createGap = (direction, gap) => {
  if (direction === 'vertical') {
    return {
      marginTop: gap,
      marginLeft: 0,
    };
  }

  return {
    marginTop: 0,
    marginLeft: gap,
  };
};
