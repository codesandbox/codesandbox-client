import React, { useEffect } from 'react';

import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { useOvermind } from 'app/overmind';
import { Item, PropertyValue, PropertyName, Icon } from '../elements';
import { FreezeContainer, FrozenWarning } from './elements';

export const Frozen: React.FC = () => {
  const {
    actions: {
      editor: { frozenUpdated, sessionFreezeOverride },
    },
    state: {
      editor: {
        currentSandbox: { isFrozen, customTemplate },
        sessionFrozen,
      },
    },
  } = useOvermind();
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
      {!sessionFrozen && (
        <FrozenWarning>Edits are enabled for this session</FrozenWarning>
      )}
    </>
  );
};
