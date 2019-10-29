import React from 'react';
import { LightIcons, DarkIcons, Icons } from '@codesandbox/template-icons';
import history from 'app/utils/history';
import getLightIcons from '@codesandbox/common/lib/templates/iconsLight';
import getDarkIcons from '@codesandbox/common/lib/templates/iconsDark';
import getColorIcons from '@codesandbox/common/lib/templates/icons';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getContrastYIQ } from '@codesandbox/common/lib/utils';
import { useOvermind } from 'app/overmind';
import { ActionButtons } from './ActionButtons';

import {
  Container,
  Icon,
  Details,
  Row,
  Title,
  Environment,
  Author,
  ActionButton,
} from './elements';

interface ISandboxCardProps {
  template: any;
  official?: boolean;
  mine?: boolean;
  team?: any;
}

export const SandboxCard: React.FC<ISandboxCardProps> = ({
  template,
  official,
  mine,
  team,
}) => {
  // @ts-ignore
  const { source, id: sandboxID, author = {} } = template.sandbox || {};
  const {
    state: { user },
  } = useOvermind();
  const myTemplate = mine || author.username === (user || {}).username;
  let UserIcon: React.FunctionComponent;
  let OfficialIcon: React.FunctionComponent;

  if (getContrastYIQ(template.color) >= 128) {
    UserIcon =
      template.iconUrl && Icons[template.iconUrl]
        ? Icons[template.iconUrl]
        : getColorIcons((source || {}).template);

    OfficialIcon = getColorIcons(template.name);
  } else {
    UserIcon =
      template.iconUrl && Icons[template.iconUrl]
        ? Icons[template.iconUrl]
        : getColorIcons((source || {}).template);

    OfficialIcon = getColorIcons(template.name);
  }

  const { actions } = useOvermind();
  const title =
    template.niceName || template.sandbox.title || template.sandbox.id;
  const url = sandboxUrl({
    id: official ? template.shortid : sandboxID,
    alias: null, // TODO: give alias
    git: null,
  });

  const openSandbox = (openNewWindow = false) => {
    if (openNewWindow === true) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }

    return actions.modalClosed();
  };

  const Open = () => (
    <ActionButton
      onClick={event => {
        const cmd = event.ctrlKey || event.metaKey;
        openSandbox(Boolean(cmd));
      }}
    >
      Open
    </ActionButton>
  );

  return (
    <>
      <Container
        to={url}
        onClick={event => {
          const cmd = event.ctrlKey || event.metaKey;
          openSandbox(Boolean(cmd));
        }}
      >
        <Icon color={template.color}>
          {official && (OfficialIcon || UserIcon) ? (
            <OfficialIcon />
          ) : (
            <UserIcon />
          )}
        </Icon>
        <Details>
          <Row>
            <Title>{title}</Title>
            {myTemplate || !user || official ? <Open /> : null}
            {user && !myTemplate && !official ? (
              <ActionButtons id={template.id} sandboxID={sandboxID} />
            ) : null}
          </Row>
          <Row>
            <Environment>{template.name || source.template}</Environment>
            <Author>By {author.username || 'CodeSandbox'}</Author>
          </Row>
        </Details>
      </Container>
    </>
  );
};
