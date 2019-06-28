import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useClickAway } from 'react-use';
import { SketchPicker } from 'react-color';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import * as templates from '@codesandbox/common/lib/templates';
import { useSignals, useStore } from 'app/store';
import { Item, PropertyName, PropertyValue, Icon } from '../elements';
import { PickColor } from './elements';

export const TemplateConfig = observer(() => {
  const picker = useRef(null);
  const {
    workspace: { editTemplate },
  } = useSignals();
  const {
    editor: {
      currentSandbox: { template, customTemplate },
    },
  } = useStore();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    (customTemplate && customTemplate.color) ||
      templates.default(template).color()
  );
  const colors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));

  useClickAway(picker, () => {
    setShowPicker(false);
    editTemplate({
      template: {
        color: selectedColor,
      },
    });
  });

  return (
    <>
      <Item flex>
        <PropertyName>
          Template{' '}
          <Tooltip
            content={
              'By making your sandbox a template you will be able to see it in your create sandbox modal and start with this sandbox quickly.'
            }
          >
            <Icon />
          </Tooltip>
        </PropertyName>
      </Item>
      <Item flex>
        <PropertyName>Template Color</PropertyName>
        <PropertyValue>
          <PickColor
            onClick={() => setShowPicker(true)}
            color={selectedColor}
          />
          {showPicker ? (
            <SketchPicker
              id="color"
              ref={picker}
              onChangeComplete={(color: { hex: string }) =>
                setSelectedColor(color.hex)
              }
              color={selectedColor}
              presetColors={[...new Set(colors)]}
            />
          ) : null}
        </PropertyValue>
      </Item>
    </>
  );
});
