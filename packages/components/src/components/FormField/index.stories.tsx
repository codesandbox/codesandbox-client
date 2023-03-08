import React from 'react';
import { FormField } from '.';
import {
  Input,
  Switch,
  Select,
  Collapsible,
  Element,
  Text,
  Button,
} from '../..';

export default {
  title: 'components/FormField',
  component: FormField,
};

export const Horizontal = () => (
  <Element
    css={{ width: 200, border: '1px solid', borderColor: 'sideBar.border' }}
  >
    <FormField label="Frozen" direction="horizontal">
      <Switch defaultOn />
    </FormField>
  </Element>
);

export const Vertical = () => (
  <Element
    css={{ width: 200, border: '1px solid', borderColor: 'sideBar.border' }}
  >
    <FormField direction="vertical" label="Repository name">
      <Select placeholder="Please select an option">
        <option>One</option>
        <option>Two</option>
      </Select>
    </FormField>
  </Element>
);

export const hideLabel = () => (
  <Element
    css={{ width: 200, border: '1px solid', borderColor: 'sideBar.border' }}
  >
    <Collapsible title="GitHub" defaultOpen>
      <Text block marginX={2} marginBottom={2}>
        Export Sandbox to GitHub
      </Text>
      <FormField direction="vertical" label="Repository name" hideLabel>
        <Input placeholder="codesandbox/components" />
      </FormField>
      <Element marginX={2}>
        <Button variant="secondary">Create Repository</Button>
      </Element>
      <Text
        size={2}
        block
        marginTop={6}
        marginX={2}
        css={{ breakWord: 'none' }}
      >
        Sometimes you don&apos;t need to show the label to a visual user because
        the section header and description give enough context. This however is
        not true for a user that&apos;s using a screen reader they would still
        require a description label to be read out. For this purpose, we
        visually hide the label but still keep in the elements tree.
      </Text>
    </Collapsible>
  </Element>
);
