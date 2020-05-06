import React from 'react';
import { createGlobalStyle } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { withRouter } from 'react-router-dom';

import { SignInModalElement } from '../SignIn/Modal';

const Style = createGlobalStyle`
  body, html, #root, #root > div, #root > div > div {
    background: transparent !important;
    background-color: transparent !important;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SignInModalHomepageComponent = () => {
  const closeModal = () => {
    const event = new CustomEvent('closeLoginModal');
    window.parent.document.dispatchEvent(event);
  };

  return (
    <>
      <Style />
      <OutsideClickHandler onOutsideClick={closeModal}>
        <SignInModalElement
          onSignIn={() => {
            window.top.location.href = 'https://codesandbox.io/dashboard';
          }}
        />
      </OutsideClickHandler>
    </>
  );
};

export const SignInModalHomepage = withRouter(SignInModalHomepageComponent);
