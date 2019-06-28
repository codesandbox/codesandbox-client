import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { useSignals, useStore } from 'app/store';
import { Item, PropertyValue, PropertyName, Icon } from '../elements';
import { FreezeContainer, FrozenWarning } from './elements';

interface IFrozenProps {
  isFrozen: boolean;
}

export const Frozen = observer(({ isFrozen }: IFrozenProps) => {
  const {
    editor: { frozenUpdated, sessionFreezeOverride },
  } = useSignals();
  const {
    editor: {
      currentSandbox: { customTemplate },
      sessionFrozen,
    },
  } = useStore();

  useEffect(() => {
    // always freeze it on start
    if (customTemplate) {
      frozenUpdated({ frozen: true });
    }
  }, [customTemplate, frozenUpdated]);

  const updateFrozenState = () => {
    if (customTemplate) {
      sessionFreezeOverride({ frozen: !isFrozen });
    }
    frozenUpdated({ frozen: !isFrozen });
  };

  return (
    <>
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
              right={customTemplate ? sessionFrozen : isFrozen}
              onClick={updateFrozenState}
              offMode
              secondary
            />
          </FreezeContainer>
        </PropertyValue>
      </Item>
      {customTemplate && !sessionFrozen ? (
        <FrozenWarning>Edits are enabled for this session</FrozenWarning>
      ) : null}
    </>
  );
});
