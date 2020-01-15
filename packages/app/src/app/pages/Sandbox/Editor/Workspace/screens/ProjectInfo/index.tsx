import React, { useEffect, MouseEvent } from 'react';
import {
  Element,
  Collapsible,
  Text,
  Avatar,
  Stack,
  List,
  ListItem,
  Button,
  Select,
  Switch,
} from '@codesandbox/components/lib';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useOvermind } from 'app/overmind';
import { GlobeIcon } from './icons';
import { Title } from './Title';
import { Description } from './Description';

const Link = props => <Text variant="muted" {...props} />;

export const ProjectInfo = () => {
  const {
    actions: {
      modalOpened,
      editor: { frozenUpdated, sessionFreezeOverride },
      workspace: { sandboxPrivacyChanged, deleteTemplate },
    },
    state: {
      editor: { currentSandbox, sessionFrozen },
      isPatron,
    },
  } = useOvermind();
  const {
    author,
    isFrozen,
    customTemplate,
    template,
    forkedFromSandbox,
    forkedTemplateSandbox,
    privacy,
  } = currentSandbox;

  useEffect(() => {
    // always freeze it on start
    if (customTemplate) {
      frozenUpdated({ frozen: true });
    }
  }, [customTemplate, frozenUpdated]);

  const updateFrozenState = () => {
    if (customTemplate) {
      return sessionFreezeOverride({ frozen: !sessionFrozen });
    }

    return frozenUpdated({ frozen: !isFrozen });
  };

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  return (
    <>
      <Collapsible title="Sandbox Info" defaultOpen>
        <Stack direction="vertical" gap={6}>
          <Element style={{ padding: '0 8px' }}>
            <Title editable />
            <Description editable />
          </Element>
          <Stack gap={2} align="center" style={{ padding: '0 8px' }}>
            <Avatar user={author} /> <Text>{author.username}</Text>
          </Stack>
          <List>
            <ListItem justify="space-between">
              <Text as="label" htmlFor="frozen">
                Frozen
              </Text>
              <Switch
                id="frozen"
                onClick={updateFrozenState}
                on={customTemplate ? sessionFrozen : isFrozen}
              />
            </ListItem>
            <ListItem justify="space-between">
              <Text> {forkedTemplateSandbox ? 'Template' : 'Forked From'}</Text>
              <Link>
                {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
              </Link>
            </ListItem>
            <ListItem justify="space-between">
              <Text>Environment</Text>
              <Link>{template}</Link>
            </ListItem>
          </List>
        </Stack>
      </Collapsible>
      <Collapsible title="Privacy" defaultOpen>
        <Stack direction="vertical" gap={4} style={{ padding: '0 8px' }}>
          <Select
            disabled={!isPatron}
            icon={GlobeIcon}
            onChange={({ target: { value } }) =>
              sandboxPrivacyChanged({
                privacy: Number(value) as 0 | 1 | 2,
                source: 'sidebar',
              })
            }
            value={privacy}
          >
            <option value={0}>Public</option>

            {isPatron && (
              <option value={1}>Unlisted (only available by url)</option>
            )}

            {isPatron && <option value={2}>Private</option>}
          </Select>
          {!isPatron ? (
            <Text variant="muted" size={2}>
              You an change privacy of a sandbox as a Pro.
              <br />
              Become a Pro.
            </Text>
          ) : null}
        </Stack>
      </Collapsible>

      <Element marginX={2} marginY={4}>
        <Button variant="secondary">Save as template</Button>
      </Element>

      <Stack
        justify="center"
        css={{ position: 'absolute', width: '100%', bottom: 8 }}
      >
        <Button
          // @ts-ignore
          onClick={onDelete}
          variant="link"
          css={{ ':hover, :focus': { color: 'dangerButton.background' } }}
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </Button>
      </Stack>
    </>
  );
};
