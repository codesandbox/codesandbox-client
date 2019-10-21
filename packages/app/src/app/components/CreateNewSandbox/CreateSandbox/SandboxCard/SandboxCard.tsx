import React, { forwardRef } from 'react';
import { LightIcons, DarkIcons } from '@codesandbox/template-icons';
import history from 'app/utils/history';
import getLightIcons from '@codesandbox/common/lib/templates/iconsLight';
import getDarkIcons from '@codesandbox/common/lib/templates/iconsDark';
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
  followed?: boolean;
  mine?: boolean;
  team?: any;
}

export const SandboxCard: React.FC<ISandboxCardProps> = forwardRef(
  ({ template, official, followed: bookmarked, mine, team }, ref) => {
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
        template.iconUrl && DarkIcons[template.iconUrl]
          ? DarkIcons[template.iconUrl]
          : getDarkIcons((source || {}).template);

      OfficialIcon = getDarkIcons(template.name);
    } else {
      UserIcon =
        template.iconUrl && LightIcons[template.iconUrl]
          ? LightIcons[template.iconUrl]
          : getLightIcons((source || {}).template);

      OfficialIcon = getLightIcons(template.name);
    }

    const { actions } = useOvermind();
    const title =
      template.niceName || template.sandbox.title || template.sandbox.id;

    const openSandbox = (openNewWindow = false, officialTemplate) => {
      const url = sandboxUrl({
        id: officialTemplate ? template.shortid : sandboxID,
      });

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
          openSandbox(Boolean(cmd), official);
        }}
      >
        Open
      </ActionButton>
    );

    return (
      <>
        <Container ref={ref}>
          <Icon color={template.color}>
            {official && (OfficialIcon || UserIcon) ? (
              <OfficialIcon />
            ) : (
              <UserIcon />
            )}
          </Icon>
          <Details>
            <Row>
              <Title
                href={sandboxUrl({
                  id: official ? template.shortid : sandboxID,
                })}
              >
                {title}
              </Title>
              {myTemplate || !user || official ? <Open /> : null}
              {user && !myTemplate && !official ? (
                <ActionButtons id={template.id} sandboxID={sandboxID} />
              ) : null}
            </Row>
            <Row>
              <Environment
                href={sandboxUrl({
                  id: official ? template.shortid : sandboxID,
                })}
              >
                {template.name || source.template}
              </Environment>
              <Author>By: {author.username || 'CodeSandbox'}</Author>
            </Row>
          </Details>
        </Container>
      </>
    );
  }
);
