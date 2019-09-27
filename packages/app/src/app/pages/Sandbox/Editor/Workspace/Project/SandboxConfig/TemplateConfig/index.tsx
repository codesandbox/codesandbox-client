import * as templates from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Link } from 'react-router-dom';
import { useClickAway } from 'react-use';

import { useOvermind } from 'app/overmind';

import { WorkspaceItem } from '../../../WorkspaceItem';

import { PropertyName, PropertyValue } from '../../elements';

import { Explanation, Item, PickColor, PickerContainer } from './elements';
import { Icon } from './Icon';

export const TemplateConfig: FunctionComponent = () => {
  const {
    actions: {
      workspace: { editTemplate },
    },
    state: {
      editor: {
        currentSandbox: { customTemplate, template },
      },
    },
  } = useOvermind();
  const picker = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    () => customTemplate.color || templates.default(template).color()
  );
  const colors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));

  useClickAway(picker, () => {
    setShowPicker(false);

    editTemplate({ ...customTemplate, color: selectedColor });
  });

  return (
    <WorkspaceItem defaultOpen showOverflow title="Template">
      <Explanation>
        This is a template, you can find more info about templates{' '}
        <Link target="_blank" to="/docs/templates">
          here
        </Link>
        .
      </Explanation>

      <Item>
        <PropertyName>Color</PropertyName>

        <PropertyValue relative>
          <PickColor
            color={selectedColor}
            onClick={() => setShowPicker(true)}
          />

          {showPicker && (
            <PickerContainer ref={picker}>
              <SketchPicker
                color={selectedColor}
                disableAlpha
                id="color"
                onChangeComplete={color => setSelectedColor(color.hex)}
                presetColors={[...new Set(colors)]}
              />
            </PickerContainer>
          )}
        </PropertyValue>
      </Item>

      <Icon />
    </WorkspaceItem>
  );
};
