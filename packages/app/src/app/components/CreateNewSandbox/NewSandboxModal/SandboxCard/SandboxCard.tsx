import React, { forwardRef } from 'react';
import * as Icons from '@codesandbox/template-icons';
import getIcon from '@codesandbox/common/lib/templates/icons';
import { TemplateType } from '@codesandbox/common/lib/templates';
import {
  Container,
  Icon,
  Details,
  Row,
  Title,
  Environment,
  Author,
} from './elements';

interface ISandboxCard {
  icon: React.ReactType<any>;
  color: string;
  author?: string;
  iconUrl: string;
  sandbox: any;
  niceName: string;
  name: TemplateType;
  official?: boolean;
}

export const SandboxCard: React.FC<ISandboxCard> = forwardRef(
  (
    {
      iconUrl,
      color,
      sandbox = { source: {} },
      niceName,
      official,
      name,
      author = 'CodeSandbox',
    },
    ref
  ) => {
    const UserIcon =
      iconUrl && Icons[iconUrl]
        ? Icons[iconUrl]
        : getIcon(sandbox.source.template);

    const OfficialIcon = getIcon(name);

    return (
      <>
        <Container ref={ref}>
          <Icon color={color}>
            {official ? <OfficialIcon /> : <UserIcon />}
          </Icon>
          <Details>
            <Row>
              <Title>{niceName}</Title>,mm
            </Row>
            <Row>
              <Environment>{name}</Environment>
              <Author>By: {author}</Author>
            </Row>
          </Details>
        </Container>
      </>
    );
  }
);
