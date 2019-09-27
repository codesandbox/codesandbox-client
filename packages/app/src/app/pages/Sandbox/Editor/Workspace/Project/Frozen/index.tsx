import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Icon, Item, PropertyName, PropertyValue } from '../elements';

import { FreezeContainer, FrozenWarning } from './elements';

export const Frozen: FunctionComponent = () => {
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
      return sessionFreezeOverride({ frozen: !sessionFrozen });
    }

    return frozenUpdated({ frozen: !isFrozen });
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
              offMode
              onClick={updateFrozenState}
              right={customTemplate ? sessionFrozen : isFrozen}
              secondary
              small
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
