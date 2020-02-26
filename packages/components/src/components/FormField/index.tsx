import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import React, {
  Children,
  cloneElement,
  ComponentProps,
  Fragment,
  FunctionComponent,
  ReactElement,
} from 'react';

import { Element, Label, Stack } from '../..';

type Props = (
  | (Omit<ComponentProps<typeof Stack>, 'children'> & {
      direction?: 'horizontal';
    })
  | (Omit<ComponentProps<typeof Element>, 'children'> & {
      direction: 'vertical';
    })
) & {
  id?: string;
  // always ask for a label
  label: string;
  // sometimes you don't need to show the label to a visual user
  // because the section header and description give enough context.
  // this however is not true for a user that's using a screen reader
  // they would still require a description label to be read out.
  // for this purpose, we visually hide the label but still  keep in the
  // elements tree.
  hideLabel?: boolean;
};
export const FormField: FunctionComponent<Props> = ({
  children,
  label,
  id,
  hideLabel = false,
  direction = 'horizontal',
  ...props
}) => {
  const inputId = useId(id);

  const InputElement = Children.map(children, child =>
    cloneElement(child as ReactElement, { id: inputId })
  );
  const LabelWrapper = hideLabel ? VisuallyHidden : Fragment;

  if (direction === 'horizontal') {
    return (
      <>
        <Stack
          align="center"
          css={{ minHeight: 8, paddingX: 2 }}
          direction="horizontal"
          justify="space-between"
          {...props}
        >
          <LabelWrapper>
            <Label htmlFor={inputId} size={3}>
              {label}
            </Label>
          </LabelWrapper>

          {InputElement}
        </Stack>
      </>
    );
  }

  return (
    <Element css={{ paddingX: 2 }} {...props}>
      <LabelWrapper>
        <Label block htmlFor={inputId} size={3}>
          {label}
        </Label>
      </LabelWrapper>

      <Stack align="center" css={{ minHeight: 8 }} direction="horizontal">
        {children}
      </Stack>
    </Element>
  );
};
