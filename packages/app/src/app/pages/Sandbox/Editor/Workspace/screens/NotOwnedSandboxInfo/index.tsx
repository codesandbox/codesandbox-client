import React from 'react';
import { Explorer } from '../Explorer';
import { Summary } from '../ProjectInfo/Summary';

export const NotOwnedSandboxInfo = () => (
  <>
    <Summary />
    <Explorer filesDefaultOpen={false} />
  </>
);
