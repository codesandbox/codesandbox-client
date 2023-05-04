import React, { FunctionComponent, useEffect, useState } from 'react';
import { Element } from '@codesandbox/components';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Overlay } from 'app/components/Overlay';
import { useAppState } from 'app/overmind';

import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { LinkPermissions } from './Collaborator';
import { ButtonActions } from './ButtonActions';
import { CollaboratorList } from './CollaboratorList';
import { OnBoarding } from './OnBoarding';

const CollaboratorContent = () => {
  const { currentSandbox } = useAppState().editor;

  const isOwner = hasPermission(currentSandbox.authorization, 'owner');

  return (
    <Container direction="vertical" style={{ borderRadius: 4 }}>
      <Element padding={4}>
        <LinkPermissions readOnly={!isOwner} />
        {isOwner && (
          <Element paddingTop={4}>
            <AddCollaboratorForm />
          </Element>
        )}
      </Element>

      <HorizontalSeparator />

      <CollaboratorList />

      <HorizontalSeparator />

      <Element padding={4}>
        <ButtonActions />
      </Element>
    </Container>
  );
};

const LOCAL_STORAGE_KEY = 'csb.onboarding-share';

export const Collaborators: FunctionComponent<{
  renderButton: (any) => JSX.Element;
}> = ({ renderButton }) => {
  const [onboardingVisibility, setOnboardingVisibility] = useState(false);

  useEffect(() => {
    let timer;

    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      /**
       * There're some many things happening in the UI
       * So, it waits 1s to show up the onboarding
       */
      timer = setTimeout(() => {
        setOnboardingVisibility(true);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onCloseOnboarding = () => {
    setOnboardingVisibility(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  return (
    <Overlay event="Collaborators" content={CollaboratorContent}>
      {open => (
        <>
          <OnBoarding
            visibility={onboardingVisibility}
            onClose={onCloseOnboarding}
          />
          {renderButton({
            onClick: () => {
              open();
              onCloseOnboarding();
            },
          })}
        </>
      )}
    </Overlay>
  );
};
