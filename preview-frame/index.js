import React from 'react';
import { render } from 'react-dom';

window.addEventListener('message', (e) => {
  console.log(e);

  // You must verify that the origin of the message's sender matches your
  // expectations. In this case, we're only planning on accepting messages
  // from our own origin, so we can simply compare the message event's
  // origin to the location of this document. If we get a message from an
  // unexpected host, ignore the message entirely.
  // if (e.origin !== (window.location.protocol + "//" + window.location.host))
  //   return;

  const exports = { default: {} }; // eslint-disable-line
  eval(e.data.code);
});
