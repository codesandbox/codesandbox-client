import * as React from 'react';

import { Button } from '@codesandbox/common/lib/components/Button';

import { inject, observer } from 'mobx-react';
import { Transition } from 'react-spring/renderprops';
import Portal from '@codesandbox/common/lib/components/Portal';

import { NotificationContainer, GlobalStyle } from './elements';

export function Notifications() {
  return (
    <Portal>
      <NotificationContainer>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#24282A',
            color: 'white',
            borderRadius: 6,

            maxWidth: 500,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#5da700',
              width: 2,
            }}
          />
          <div style={{ padding: '.75rem 1rem' }}>
            <div
              style={{
                fontFamily: 'Poppins',
                marginBottom: '.5rem',
              }}
            >
              Module Succesfully Saved
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '.875rem',
              }}
            >
              Your module was successfully saved, you can now leave CodeSandbox
            </div>

            <div
              style={{ display: 'flex', float: 'right', fontSize: '.875rem' }}
            >
              <Button
                secondary
                small
                style={{
                  marginTop: '1rem',
                  marginRight: '0.5rem',
                  lineHeight: 1,
                }}
              >
                Close Sandbox
              </Button>
              <Button
                small
                style={{
                  marginTop: '1rem',
                  marginLeft: '0.5rem',
                  lineHeight: 1,
                }}
              >
                Open CodeSandbox
              </Button>
            </div>
          </div>
        </div>
      </NotificationContainer>
    </Portal>
  );
}
