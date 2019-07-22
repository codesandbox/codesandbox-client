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

export const Frozen = observer<IFrozenProps>(({ isFrozen }) => {
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
      <Item>
        <PropertyName>
          Frozen
          <Tooltip
            boundary="viewport"
            content="Whether we should fork the sandbox on edits"
          >
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
      {customTemplate && !sessionFrozen && (
        <FrozenWarning>Edits are enabled for this session</FrozenWarning>
      )}
    </>
  );
});
