import React from 'react';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const ShowcaseSandbox = ({ sandbox }) => (
  <Element
    as="iframe"
    src={`https://${sandbox.id}.csb.app?standalone=1`}
    css={css({
      backgroundColor: 'white',
      width: '100%',
      height: 360,
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'grays.600',
    })}
    title="React"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  />
);
