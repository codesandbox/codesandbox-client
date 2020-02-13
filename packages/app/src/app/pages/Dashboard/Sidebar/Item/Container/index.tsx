import React, { ComponentProps, FunctionComponent } from 'react';

import { ContextMenu } from 'app/components/ContextMenu';

import { Container as ContainerBase } from './elements';

type ContainerBaseProps = ComponentProps<typeof ContainerBase>;
type Props = {
  contextItems?: ComponentProps<typeof ContextMenu>['items'];
} & Partial<Pick<ContainerBaseProps, 'onClick' | 'style'>> &
  Pick<ContainerBaseProps, 'active' | 'as' | 'exact' | 'to'>;
export const Container: FunctionComponent<Props> = ({
  contextItems,
  ...props
}) => {
  if (!contextItems) {
    return <ContainerBase {...props} />;
  }

  return (
    <ContextMenu items={contextItems}>
      <ContainerBase {...props} />
    </ContextMenu>
  );
};
