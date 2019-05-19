import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { SketchPicker } from 'react-color';
import { inject } from 'mobx-react';
import { Button } from '@codesandbox/common/lib/components/Button';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import { Checkbox } from '@codesandbox/common/lib/components/Checkbox';
import * as templates from '@codesandbox/common/lib/templates';

import uniq from 'lodash-es/uniq';

import { Heading, Container, Explanation } from '../elements';
import {
  Fieldset,
  Label,
  DefaultColor,
  GlobalStylesStarterModal,
} from './elements';

const StarterModal = ({ store, signals }) => {
  const templateColors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));
  const sandbox = store.editor.currentSandbox;
  const template = templates.default(sandbox.template);

  const { title, description } = store.workspace.project;
  const [selected, setSelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(template.color());
  const [starterTitle, setStaterTitle] = useState(title);
  const [starterDescription, setStaterDescription] = useState(description);
  const makeStarter = e => {
    e.preventDefault();
    signals.workspace.addedTemplate({
      id: sandbox.id,
      template: {
        color: selectedColor,
        title: starterTitle,
        description: starterDescription,
        icon: sandbox.template,
        published: selected,
      },
    });
  };

  return (
    <Container>
      <GlobalStylesStarterModal />
      <Heading>Make Template</Heading>
      <Explanation>
        By making your sandbox a template you will be able to see it in your
        create sandbox modal and start with this sandbox quickly.
        <br />
        If you decide to make it public it can be used by anyone in the
        CodeSandbox community.
      </Explanation>
      <form onSubmit={makeStarter}>
        <Fieldset>
          <Label htmlFor="title">Title</Label>
          <Input
            block
            name="title"
            required
            id="title"
            value={starterTitle}
            onChange={e => setStaterTitle(e.target.value)}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="description">Description</Label>
          <TextArea
            block
            required
            name="description"
            id="description"
            value={starterDescription}
            onChange={e => setStaterDescription(e.target.value)}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="public">Make Public?</Label>
          <Checkbox
            checked={selected}
            id="public"
            onChange={() => setSelected(!selected)}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="color">Template Color?</Label>
          <DefaultColor
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            id="color"
            color={selectedColor}
          />
          {showPicker ? (
            <OutsideClickHandler
              onOutsideClick={() => {
                setShowPicker(false);
              }}
            >
              <SketchPicker
                id="color"
                onChangeComplete={color => setSelectedColor(color.hex)}
                color={selectedColor}
                presetColors={uniq(templateColors)}
              />
            </OutsideClickHandler>
          ) : null}
        </Fieldset>
        <Button
          css={`
            margin-top: 1rem;
          `}
          small
        >
          Make Template
        </Button>
      </form>
    </Container>
  );
};

export default inject('store', 'signals')(StarterModal);
