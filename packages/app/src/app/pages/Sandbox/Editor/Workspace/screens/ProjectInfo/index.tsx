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
import styled, { withTheme } from 'styled-components';
import { GlobeIcon } from './icons';
import { Title } from './Title';
import { Description } from './Description';
import { Stats } from './Stats';

const DeleteButton = styled(Button)`
  &:hover,
  &:focus {
    color: ${props => props.theme.colors.dangerButton.background};
  }
`;

const Link = props => <Text variant="muted" {...props} />;

export const ProjectInfoComponent = ({ theme }) => {
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
          <Element style={{ padding: `0 ${theme.space[3]}` }}>
            <Title editable />
            <Description editable />
          </Element>
          <Stack
            gap={2}
            align="center"
            marginBottom={4}
            style={{ padding: `0 ${theme.space[3]}` }}
          >
            <Avatar user={author} /> <Text>{author.username}</Text>
          </Stack>
          <Stats sandbox={currentSandbox} />
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
        <Stack
          direction="vertical"
          gap={4}
          style={{ padding: `0 ${theme.space[3]}` }}
        >
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
        style={{ position: 'absolute', width: '100%', bottom: theme.space[3] }}
      >
        <DeleteButton
          // @ts-ignore
          onClick={onDelete}
          variant="link"
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </DeleteButton>
      </Stack>
    </>
  );
};

export const ProjectInfo = withTheme(ProjectInfoComponent);
