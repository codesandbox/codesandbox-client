import React, { forwardRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LightIcons, DarkIcons } from '@codesandbox/template-icons';
import history from 'app/utils/history';
import getLightIcons from '@codesandbox/common/lib/templates/iconsLight';
import getDarkIcons from '@codesandbox/common/lib/templates/iconsDark';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getContrastYIQ } from '@codesandbox/common/lib/utils';
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
// @ts-ignore
import { bookmarkTemplate, unbookmarkTemplate } from './mutations.gql';
// @ts-ignore
import { getSandboxInfo } from './queries.gql';

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
    let UserIcon: React.FunctionComponent;
    let OfficialIcon: React.FunctionComponent;
    const ID = official ? template.shortid : sandboxID;

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

    const config = () => ({
      variables: {
        template: ID,
        ...(team ? { team: team.id } : {}),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        template: {
          __typename: 'Template',
          id: ID,
          bookmarked,
        },
      },
      update: (proxy: any, { data }) => {
        console.log(data);
        // const result = proxy.readQuery({
        //   query: getSandboxInfo,
        //   variables: { id: sandboxId },
        // });
        // proxy.writeQuery({
        //   query: getSandboxInfo,
        //   variables: { id: sandboxId },
        //   data: {
        //     sandbox: {
        //       ...result.sandbox,
        //       customTemplate: {
        //         ...result.sandbox.customTemplate,
        //         following: template.following,
        //       },
        //     },
        //   },
        // });
      },
    });

    const [follow] = useMutation<any, any>(bookmarkTemplate, config());
    const [unfollow] = useMutation<any, any>(unbookmarkTemplate, config());

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
              {bookmarked ? (
                <ActionButton onClick={() => unfollow()}>Remove</ActionButton>
              ) : null}

              {!bookmarked && !mine ? (
                <ActionButton onClick={() => follow()}>+ Bookmark</ActionButton>
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
