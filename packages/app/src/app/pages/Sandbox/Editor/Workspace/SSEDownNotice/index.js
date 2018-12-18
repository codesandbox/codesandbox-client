import React from 'react';
import { observer, inject } from 'mobx-react';
import getTemplate from 'common/templates';

import { Container, Trouble } from './elements';

const ConnectionNotice = ({ store }) => {
  const templateDef = getTemplate(store.editor.currentSandbox.template);
  if (!templateDef.isServer) {
    return null;
  }

  if (store.server.status !== 'disconnected') {
    return null;
  }

  return (
    <Container>
      <Trouble>Server Connection Trouble</Trouble>
      It seems like our Server Manager is either updating or experiencing some
      heavy load. Reconnecting in a couple seconds...
      <p
        css={`
          margin-bottom: 0px;
        `}
      >
        We{"'"}re working on fixing this as soon as possible. If this isn{"'"}t
        resolved with in a minute it would greatly help us if you could let us
        know on{' '}
        <a
          css={`
            color: white;
          `}
          href="https://spectrum.chat/codesandbox"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spectrum
        </a>
        .
      </p>
    </Container>
  );
};

export default inject('store')(observer(ConnectionNotice));
