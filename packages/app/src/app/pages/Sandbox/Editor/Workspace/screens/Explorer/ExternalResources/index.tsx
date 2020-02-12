import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import CrossIcon from 'react-icons/lib/md/clear';

import {
  Collapsible,
  Link,
  Stack,
  Input,
  Select,
  FormField,
  List,
  ListAction,
  SidebarRow,
  Button,
} from '@codesandbox/components';
import css from '@styled-system/css';

import { fonts as listOfFonts } from './google-fonts';

const isGoogleFont = url => url.includes('fonts.googleapis.com/css');

export const ExternalResources: FunctionComponent = () => {
  const {
    actions: {
      workspace: { externalResourceAdded, externalResourceRemoved },
    },
    state: {
      editor: {
        currentSandbox: { externalResources, template },
      },
    },
  } = useOvermind();

  const fonts = externalResources.filter(isGoogleFont);
  const otherResources = externalResources.filter(
    resource => !isGoogleFont(resource)
  );

  const { externalResourcesEnabled } = getTemplateDefinition(template);
  if (!externalResourcesEnabled) return null;

  return (
    <Collapsible title="External resources">
      <Stack direction="vertical" gap={6}>
        {otherResources.length || fonts.length ? (
          <List>
            {otherResources.map(resource => (
              <ListAction
                key={resource}
                justify="space-between"
                css={{
                  button: { opacity: 0 },
                  ':hover, :focus-within': { button: { opacity: 1 } },
                }}
              >
                <Link href={resource} target="_blank">
                  {getName(resource)}
                </Link>
                <Button
                  variant="link"
                  css={css({ width: 'auto' })}
                  onClick={() => externalResourceRemoved(resource)}
                >
                  <CrossIcon />
                </Button>
              </ListAction>
            ))}

            {fonts.map(resource => (
              <ListAction
                key={resource}
                justify="space-between"
                css={{
                  button: { opacity: 0 },
                  ':hover, :focus-within': { button: { opacity: 1 } },
                }}
              >
                <Link href={resource} target="_blank">
                  {getFontFamily(resource).name}
                </Link>
                <Button
                  variant="link"
                  css={css({ width: 'auto' })}
                  onClick={() => externalResourceRemoved(resource)}
                >
                  <CrossIcon />
                </Button>
              </ListAction>
            ))}
          </List>
        ) : null}

        <form
          key={otherResources.length}
          onSubmit={event => {
            event.preventDefault();
            const url = event.target[0].value.trim();
            externalResourceAdded(url);
          }}
        >
          <FormField label="External URL" direction="vertical">
            <Input type="text" placeholder="https://cdn.com/bootstrap.css" />
          </FormField>
          <SidebarRow marginX={2}>
            <Button variant="secondary" type="submit">
              Add resource
            </Button>
          </SidebarRow>
        </form>

        <form
          key={fonts.length}
          onSubmit={event => {
            event.preventDefault();
            const fontName = event.target[0].value.trim().replace(/ /g, '+');
            const url = `https://fonts.googleapis.com/css?family=${fontName}&display=swap`;
            externalResourceAdded(url);
          }}
        >
          <FormField label="Google Fonts" direction="vertical">
            <Select placeholder="Select a font family">
              {listOfFonts.sort().map(name => (
                <option key={name}>{name}</option>
              ))}
            </Select>
          </FormField>
          <SidebarRow marginX={2}>
            <Button variant="secondary">Add font</Button>
          </SidebarRow>
        </form>
      </Stack>
    </Collapsible>
  );
};

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

const getName = (resource: string) => {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);

    if (match && match[1]) {
      return match[1];
    }
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
};

const getFontFamily = (search: string) => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const family = hashes
    .find(hash => hash.split('=')[0] === 'family')
    .split('=')[1];

  return {
    name: family.split('+').join(' '),
    id: family
      .split('+')
      .join('-')
      .toLowerCase(),
  };
};
