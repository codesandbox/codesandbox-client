import getTemplateDefinition from '@codesandbox/common/lib/templates';
import {
  Button,
  Collapsible,
  FormField,
  Input,
  Link,
  List,
  ListAction,
  Select,
  SidebarRow,
  Stack,
} from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';

import { useAppState, useActions } from 'app/overmind';

import { fonts as listOfFonts } from './google-fonts';

const isGoogleFont = url => url.includes('fonts.googleapis.com/css');

type Props = {
  readonly: boolean;
};
export const ExternalResources: FunctionComponent<Props> = ({ readonly }) => {
  const {
    externalResourceAdded,
    externalResourceRemoved,
  } = useActions().workspace;
  const {
    currentSandbox: { externalResources, template },
  } = useAppState().editor;

  const fonts = externalResources.filter(isGoogleFont);
  const otherResources = externalResources.filter(
    resource => !isGoogleFont(resource)
  );

  const { externalResourcesEnabled } = getTemplateDefinition(template);
  if (!externalResourcesEnabled) {
    return null;
  }

  return (
    <Collapsible title="External resources">
      <Stack direction="vertical" gap={6}>
        {otherResources.length || fonts.length ? (
          <List>
            {otherResources.map(resource => (
              <ListAction
                css={{
                  button: { opacity: 0 },
                  ':hover, :focus-within': { button: { opacity: 1 } },
                }}
                justify="space-between"
                key={resource}
              >
                <Link block maxWidth="100%" href={resource} target="_blank">
                  {getName(resource)}
                </Link>

                {readonly ? null : (
                  <Button
                    css={css({ width: 'auto' })}
                    onClick={() => externalResourceRemoved(resource)}
                    variant="link"
                  >
                    <CrossIcon />
                  </Button>
                )}
              </ListAction>
            ))}

            {fonts.map(resource => (
              <ListAction
                css={{
                  button: { opacity: 0 },
                  ':hover, :focus-within': { button: { opacity: 1 } },
                }}
                justify="space-between"
                key={resource}
              >
                <Link href={resource} target="_blank">
                  {getFontFamily(resource).name}
                </Link>

                {readonly ? null : (
                  <Button
                    css={css({ width: 'auto' })}
                    onClick={() => externalResourceRemoved(resource)}
                    variant="link"
                  >
                    <CrossIcon />
                  </Button>
                )}
              </ListAction>
            ))}
          </List>
        ) : null}

        {readonly ? null : (
          <form
            onSubmit={event => {
              event.preventDefault();
              const url = event.target[0].value.trim();
              externalResourceAdded(url);
            }}
          >
            <FormField label="External URL" direction="vertical">
              <Input
                key={otherResources.length}
                placeholder="https://cdn.com/bootstrap.css"
                required
                type="text"
              />
            </FormField>

            <SidebarRow marginX={2}>
              <Button type="submit" variant="secondary">
                Add resource
              </Button>
            </SidebarRow>
          </form>
        )}

        {readonly ? null : (
          <form
            onSubmit={event => {
              event.preventDefault();
              const fontName = event.target[0].value.trim().replace(/ /g, '+');
              const url = `https://fonts.googleapis.com/css?family=${fontName}&display=swap`;
              externalResourceAdded(url);
            }}
          >
            <FormField direction="vertical" label="Google Fonts">
              <Select
                key={fonts.length}
                placeholder="Select a font family"
                required
              >
                {listOfFonts.sort().map(name => (
                  <option key={name}>{name}</option>
                ))}
              </Select>
            </FormField>

            <SidebarRow marginX={2}>
              <Button type="submit" variant="secondary">
                Add font
              </Button>
            </SidebarRow>
          </form>
        )}
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
    .find(hash => hash && hash.split('=')[0] === 'family')
    .split('=')[1];

  return {
    name: family.split('+').join(' '),
    id: family.split('+').join('-').toLowerCase(),
  };
};
