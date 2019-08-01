import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SandboxCard, { Props } from './';
import * as fake from './fixtures';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/SandboxCard', module).addDecorator(
  ThemeDecorator
);

const createSandboxStory = ({
  sandbox = fake.sandbox(),
  selectSandbox = action('selectSandbox'),
  small,
  noHeight,
  defaultHeight,
  noMargin,
}: Partial<Props>) => () => (
  <SandboxCard
    sandbox={sandbox}
    selectSandbox={selectSandbox}
    small={small}
    noHeight={noHeight}
    defaultHeight={defaultHeight}
    noMargin={noMargin}
  />
);

stories.add('basic', createSandboxStory({}));

stories.add('small', createSandboxStory({ small: true }));

stories.add('no height', createSandboxStory({ noHeight: true }));

stories.add('default height', createSandboxStory({ defaultHeight: 500 }));

stories.add('no margin', createSandboxStory({ noMargin: true }));

stories.add('popular', createSandboxStory({ sandbox: fake.popularSandbox() }));

stories.add(
  'many tags',
  createSandboxStory({ sandbox: fake.sandboxWithManyTags() })
);

stories.add(
  'long title',
  createSandboxStory({ sandbox: fake.sandboxWithLongTitle() })
);

stories.add(
  'long description',
  createSandboxStory({
    sandbox: fake.sandboxWithLongDescription(),
  })
);

stories.add(
  'null author',
  createSandboxStory({
    sandbox: fake.sandboxWithNullAuthor(),
  })
);

stories.add(
  'undefined author',
  createSandboxStory({
    sandbox: fake.sandboxWithUndefinedAuthor(),
  })
);

stories.add(
  'null screenshot url',
  createSandboxStory({
    sandbox: fake.sandboxWithNullScreenshotUrl(),
  })
);

stories.add(
  'undefined screenshot url',
  createSandboxStory({
    sandbox: fake.sandboxWithUndefinedScreenshotUrl(),
  })
);
