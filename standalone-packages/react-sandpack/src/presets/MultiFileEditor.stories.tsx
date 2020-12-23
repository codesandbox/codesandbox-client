import React from 'react';
import { Story } from '@storybook/react';
import { MultiFileEditor, MultiFileEditorProps } from './MultiFileEditor';

export default {
  title: 'presets/Multi-File Editor',
  component: MultiFileEditor,
};

const reactCode = `import React from 'react';
import Button from './button';

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button />
    </div>
  )
}
`;

const buttonCode = `import React from 'react';

export default function Button() {
  return <button>Click me</button>
}
`;

export const ReactEditor: Story<MultiFileEditorProps> = args => (
  <MultiFileEditor
    {...args}
    editableFiles={{
      '/App.js': { code: reactCode },
      '/button.js': { code: buttonCode },
    }}
    template="create-react-app"
  />
);
