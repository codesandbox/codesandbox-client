import React from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import { useId } from '@reach/auto-id';
import { Element, Stack, Label } from '../../index';

interface IFormFieldProps {
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
  direction?: 'horizontal' | 'vertical';
}

export const FormField: React.FC<IFormFieldProps> = ({
  label,
  id,
  hideLabel = false,
  direction = 'horizontal',
  ...props
}) => {
  const inputId = useId(id);

  const LabelWrapper = hideLabel ? VisuallyHidden : React.Fragment;
  const InputElement = React.Children.map(props.children, child =>
    React.cloneElement(child as React.ReactElement<any>, {
      id: inputId,
    })
  );

  if (direction === 'horizontal') {
    return (
      <Stack
        direction="horizontal"
        justify="space-between"
        align="center"
        css={{ minHeight: 8, paddingX: 2 }}
        {...props}
      >
        <LabelWrapper>
          <Label htmlFor={inputId} size={3}>
            {label}
          </Label>
        </LabelWrapper>
        {InputElement}
      </Stack>
    );
  }

  return (
    <Element
      css={{
        paddingX: 2,
      }}
      {...props}
    >
      <LabelWrapper>
        <Label htmlFor={inputId} size={3} block>
          {label}
        </Label>
      </LabelWrapper>
      <Stack direction="horizontal" align="center" css={{ minHeight: 8 }}>
        {props.children}
      </Stack>
    </Element>
  );
};
