import { Template } from '@codesandbox/common/lib/types';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { Container } from '../elements';

import { ContainerLink } from './elements';

type Props = {
  collectionId?: string;
  createSandbox: (template: Pick<Template, 'shortid'>) => void;
  template: Template | null;
};
export const MostUsedSandbox: FunctionComponent<Props> = ({
  collectionId,
  createSandbox,
  template,
}) => {
  if (!template) {
    return null;
  }

  const buttonName = `Create ${template.niceName} Sandbox`;
  return collectionId ? (
    <Container
      color={template.color}
      onClick={() => createSandbox(template)}
      role="button"
      tabIndex={0}
    >
      {buttonName}
    </Container>
  ) : (
    <ContainerLink
      color={template.color}
      to={sandboxUrl({ alias: null, id: template.shortid })}
    >
      {buttonName}
    </ContainerLink>
  );
};
