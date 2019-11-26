import Switch from '@codesandbox/common/lib/components/Switch';
import * as templates from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Link } from 'react-router-dom';
import { useClickAway } from 'react-use';

import { useOvermind } from 'app/overmind';

import { WorkspaceItem } from '../../WorkspaceItem';

import { Explanation, Item, PropertyName, PropertyValue } from '../elements';

import { PickColor, PickerContainer, PublicValue } from './elements';
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
  const [publicTemplate, setPublic] = useState(
    customTemplate.published || false
  );
  const [selectedColor, setSelectedColor] = useState(
    () => customTemplate.color || templates.default(template).color()
  );

  const colors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));

  useClickAway(picker, () => {
    setShowPicker(false);

    editTemplate({
      ...customTemplate,
      color: selectedColor,
    });
  });

  const togglePublic = () => {
    editTemplate({
      ...customTemplate,
      published: !publicTemplate,
    });

    setPublic(!publicTemplate);
  };

  return (
    <WorkspaceItem showOverflow defaultOpen title="Template">
      <Explanation style={{ marginTop: 0, marginBottom: '.5rem' }}>
        This is a template, you can find more info about templates{' '}
        <Link target="_blank" to="/docs/templates">
          here
        </Link>
        .
      </Explanation>

      <Item style={{ marginTop: '0.5rem' }}>
        <PropertyName>Color</PropertyName>

        <PropertyValue relative>
          <PickColor
            onClick={() => setShowPicker(true)}
            color={selectedColor}
          />

          {showPicker && (
            <PickerContainer ref={picker}>
              <SketchPicker
                disableAlpha
                id="color"
                onChangeComplete={(color: { hex: string }) =>
                  setSelectedColor(color.hex)
                }
                color={selectedColor}
                presetColors={[...new Set(colors)]}
              />
            </PickerContainer>
          )}
        </PropertyValue>
      </Item>

      <Item>
        <PublicValue>
          <Switch
            small
            onClick={togglePublic}
            right={publicTemplate}
            offMode
            secondary
          />
        </PublicValue>
      </Item>

      <Icon />
    </WorkspaceItem>
  );
};
