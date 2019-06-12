import React from 'react';
import { observer } from 'mobx-react-lite';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { useSignals } from 'app/store';

import { Item, PropertyValue, PropertyName, Icon } from '../elements';
import { FreezeContainer } from './elements';

type Props = {
  frozen: boolean;
};

const FrozenComponent = ({ frozen }: Props) => {
  const { editor } = useSignals();

  const updateFrozenState = () => {
    editor.frozenUpdated({
      frozen: !frozen,
    });
  };

  return (
    // @ts-ignore
    <Item style={{ marginTop: 5 }} flex>
      <PropertyName>
        Frozen
        <Tooltip content="When true this sandbox will fork on edit">
          <Icon />
        </Tooltip>
      </PropertyName>
      <PropertyValue>
        <FreezeContainer>
          <Switch
            small
            right={frozen}
            onClick={updateFrozenState}
            offMode
            secondary
          />
        </FreezeContainer>
      </PropertyValue>
    </Item>
  );
};

export default observer(FrozenComponent);
