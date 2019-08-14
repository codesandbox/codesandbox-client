import getTemplate from '@codesandbox/common/lib/templates';
import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import { Container } from './elements';

export const SSEDownNotice = inject('store')(
  hooksObserver(
    ({
      store: {
        editor: {
          currentSandbox: { template },
        },
        server: { status },
      },
    }) => {
      if (!getTemplate(template).isServer) {
        return null;
      }

      if (status !== 'disconnected') {
        return null;
      }

      return (
        <Container>
          <p
            style={{
              color: '#FFFFFF',
              fontSize: '.875rem',
              fontWeight: 700,
              marginTop: 0,
            }}
          >
            Server Connection Trouble
          </p>
          It seems like our Server Manager is either updating or experiencing
          some heavy load. Reconnecting in a couple seconds...
          <p style={{ marginBottom: 0 }}>
            We
            {"'"}
            re working on fixing this as soon as possible. If this isn
            {"'"}t resolved with in a minute it would greatly help us if you
            could let us know on{' '}
            <a
              href="https://spectrum.chat/codesandbox"
              rel="noopener noreferrer"
              style={{ color: '#FFFFFF' }}
              target="_blank"
            >
              Spectrum
            </a>
            .
          </p>
        </Container>
      );
    }
  )
);
