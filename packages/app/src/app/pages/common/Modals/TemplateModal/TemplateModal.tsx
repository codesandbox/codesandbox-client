import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { SketchPicker } from 'react-color';
import { Button } from '@codesandbox/common/lib/components/Button';
// import { Checkbox } from '@codesandbox/common/lib/components/Checkbox';
import * as templates from '@codesandbox/common/lib/templates';
import { useStore, useSignals } from 'app/store';
import {
  GlobalStylesTemplateModal,
  Container,
  Title,
  Close,
  Description,
  TemplateName,
  TemplateDescription,
  InputRow,
  Label,
  DefaultColor,
  Actions,
} from './elements';

export const TemplateModal = () => {
  const { editor, workspace } = useStore();
  const { modalClosed, workspace: workspaceSignals } = useSignals();

  const templateColors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));
  const sandbox = editor.currentSandbox;
  const template = templates.default(sandbox.template);

  const { title, description } = sandbox.customTemplate || workspace.project;
  // const [selected, setSelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    (sandbox.customTemplate && sandbox.customTemplate.color) || template.color()
  );
  const [templateTitle, setStaterTitle] = useState(title);
  const [templateDescription, setStaterDescription] = useState(description);

  const newTemplate = {
    template: {
      color: selectedColor,
      title: templateTitle,
      description: templateDescription,
      icon_url: sandbox.template,
      // published: selected,
    },
  };

  const makeTemplate = e => {
    e.preventDefault();
    workspaceSignals.addedTemplate({
      ...newTemplate,
    });
  };

  const editTemplate = e => {
    e.preventDefault();
    workspaceSignals.editTemplate({
      ...newTemplate,
    });
  };

  return (
    <Container>
      <GlobalStylesTemplateModal />
      <Close onClick={() => modalClosed()} />
      <Title>{sandbox.customTemplate ? `Edit ` : `Make `}Template</Title>
      <Description>
        By making your sandbox a template you will be able to see it in your
        create sandbox modal and start with this sandbox quickly.
      </Description>
      <TemplateName
        block
        name="title"
        required
        id="title"
        placeholder="Template Title"
        value={templateTitle}
        onChange={e => setStaterTitle(e.target.value)}
      />
      <TemplateDescription
        block
        required
        name="description"
        id="description"
        placeholder="No description, create one!"
        value={templateDescription}
        onChange={e => setStaterDescription(e.target.value)}
      />
      {/* <Fieldset>
        <Label htmlFor="public">Make Public?</Label>
        <Checkbox
          checked={selected}
          id="public"
          onChange={() => setSelected(!selected)}
        />
      </Fieldset> */}
      <InputRow>
        <Label htmlFor="color">Template Color:</Label>
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
              presetColors={[...new Set(templateColors)]}
            />
          </OutsideClickHandler>
        ) : null}
      </InputRow>
      <Actions single={!sandbox.customTemplate}>
        {sandbox.customTemplate ? (
          <>
            <Button
              small
              danger
              onClick={() => workspaceSignals.deleteTemplate()}
              type="button"
            >
              Delete Template
            </Button>
            <Button small onClick={editTemplate} type="button">
              Save Changes
            </Button>
          </>
        ) : (
          <Button small onClick={makeTemplate}>
            Make Template
          </Button>
        )}
      </Actions>
    </Container>
  );
};
