import React, { forwardRef } from 'react';
import { LightIcons, DarkIcons } from '@codesandbox/template-icons';
import history from 'app/utils/history';
import getLightIcons from '@codesandbox/common/lib/templates/iconsLight';
import getDarkIcons from '@codesandbox/common/lib/templates/iconsDark';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
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

interface ISandboxCard {
  template: any;
  official?: boolean;
  followed?: boolean;
  mine?: boolean;
  onUnfollow?: (id: string) => void;
  onFollow?: (id: string) => void;
}

function getContrastYIQ(hex: string) {
  // @ts-ignore
  const color = typeof hex === 'function' ? hex() : hex;
  const cleanColor = color.split('#')[1];
  const r = parseInt(cleanColor.substr(0, 2), 16);
  const g = parseInt(cleanColor.substr(2, 2), 16);
  const b = parseInt(cleanColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq;
}

export const SandboxCard: React.FC<ISandboxCard> = forwardRef(
  ({ template, official, followed, mine, onUnfollow, onFollow }, ref) => {
    // @ts-ignore
    const { source, id: sandboxID, author = {} } = template.sandbox || {};
    let UserIcon;
    let OfficialIcon;

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
      const url = officialTemplate
        ? sandboxUrl({ id: template.shortid })
        : sandboxUrl({ id: sandboxID });

      if (openNewWindow === true) {
        window.open(url, '_blank');
      } else {
        history.push(url);
      }

      return actions.modalClosed();
    };

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
                href={
                  official
                    ? sandboxUrl({ id: template.shortid })
                    : sandboxUrl({ id: sandboxID })
                }
              >
                {title}
              </Title>
              {mine ? (
                <ActionButton
                  onClick={event => {
                    const cmd = event.ctrlKey || event.metaKey;
                    openSandbox(Boolean(cmd), official);
                  }}
                >
                  Open
                </ActionButton>
              ) : null}
              {followed ? (
                <ActionButton onClick={() => onUnfollow(sandboxID)}>
                  Remove
                </ActionButton>
              ) : null}

              {!followed && !mine ? (
                <ActionButton onClick={() => onFollow(sandboxID)}>
                  + Bookmark
                </ActionButton>
              ) : null}
            </Row>
            <Row>
              <Environment
                href={
                  official
                    ? sandboxUrl({ id: template.shortid })
                    : sandboxUrl({ id: sandboxID })
                }
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
