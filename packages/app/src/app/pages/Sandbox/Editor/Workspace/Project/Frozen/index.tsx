import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { useSignals, useStore } from 'app/store';

import { Item, PropertyValue, PropertyName, Icon } from '../elements';
import { FreezeContainer, FrozenWarning } from './elements';

type Props = {
  frozen: boolean;
};

const FrozenComponent = ({ frozen }: Props) => {
  const { editor } = useSignals();
  const {
    editor: { currentSandbox, sessionFrozen },
  } = useStore();

  useEffect(() => {
    // always freeze it on start
    if (currentSandbox.customTemplate) {
      editor.frozenUpdated({
        frozen: true,
      });
    }
  }, [currentSandbox.customTemplate, editor]);

  const updateFrozenState = () => {
    if (currentSandbox.customTemplate) {
      editor.sessionFreezeOverride({
        frozen: !frozen,
      });
    }
    editor.frozenUpdated({
      frozen: !frozen,
    });
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
              right={currentSandbox.customTemplate ? sessionFrozen : frozen}
              onClick={updateFrozenState}
              offMode
              secondary
            />
          </FreezeContainer>
        </PropertyValue>
      </Item>
      {currentSandbox.customTemplate && !sessionFrozen ? (
        <FrozenWarning>Edits are enabled for this session</FrozenWarning>
      ) : null}
    </>
  );
};

export default observer(FrozenComponent);
