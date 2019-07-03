import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useClickAway } from 'react-use';
import { SketchPicker } from 'react-color';
import * as templates from '@codesandbox/common/lib/templates';
import { useSignals, useStore } from 'app/store';
import { Item, PropertyName, PropertyValue, Explanation } from '../elements';
import { PickColor, PickerContainer } from './elements';
import WorkspaceItem from '../../WorkspaceItem';

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
    <WorkspaceItem defaultOpen title="Template">
      <Explanation style={{ marginTop: 0, marginBottom: '.5rem' }}>
        This is a template, you can find more info about templates
        <Link target="_blank" to={`/docs/templates`}>
          {' '}
          here
        </Link>
        .
      </Explanation>
      <Item style={{ marginTop: '0.5rem' }}>
        <PropertyName>Color</PropertyName>
        <PropertyValue style={{ position: 'relative' }}>
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
    </WorkspaceItem>
  );
});
