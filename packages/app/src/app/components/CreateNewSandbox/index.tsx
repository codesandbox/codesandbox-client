import Template from '@codesandbox/common/lib/templates/template';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, {
  ComponentProps,
  FunctionComponent,
  HTMLAttributes,
  KeyboardEvent,
} from 'react';

import { useActions } from 'app/overmind';
import history from 'app/utils/history';

import { ButtonsContainer, Container } from './elements';
import { MostUsedSandbox } from './MostUsedSandbox';

type Props = {
  collectionId?: string;
  mostUsedSandboxTemplate: ComponentProps<typeof MostUsedSandbox>['template'];
} & Pick<HTMLAttributes<HTMLDivElement>, 'style'>;
export const CreateNewSandboxButton: FunctionComponent<Props> = ({
  collectionId,
  mostUsedSandboxTemplate,
  style,
}) => {
  const {
    dashboard: { createSandboxClicked },
    openCreateSandboxModal,
  } = useActions();

  const createSandbox = ({ shortid }: Pick<Template, 'shortid'>) => {
    if (collectionId) {
      createSandboxClicked({ body: { collectionId }, sandboxId: shortid });
    } else {
      setTimeout(() => {
        history.push(sandboxUrl({ alias: null, id: shortid }));
      }, 300);
    }
  };

  const handleClick = () => {
    openCreateSandboxModal({ collectionId });
  };

  return (
    <div style={style}>
      <ButtonsContainer>
        <Container
          onClick={handleClick}
          tabIndex={0}
          role="button"
          onKeyDown={({ keyCode }: KeyboardEvent) => {
            if (keyCode === ENTER) {
              handleClick();
            }
          }}
        >
          Create Sandbox
        </Container>

        <MostUsedSandbox
          createSandbox={createSandbox}
          template={mostUsedSandboxTemplate}
        />
      </ButtonsContainer>
    </div>
  );
};
