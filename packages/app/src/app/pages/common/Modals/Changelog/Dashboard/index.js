import React from 'react';
import { inject } from 'mobx-react';
import theme from 'common/theme';

import Button from 'app/components/Button';

// Inline styles because styled-components didn't load the styles
const titleStyles = {
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.125rem',
  marginTop: 0,
  marginBottom: 0,
  width: '100%',
  textTransform: 'uppercase',
};

const dateStyles = {
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '.875rem',
  float: 'right',
  width: '100%',
  textAlign: 'right',
};

const subTitleStyles = {
  fontWeight: 600,
  color: 'rgba(255, 255, 255, .9)',
  fontSize: '1rem',
  marginTop: '1rem',
  marginBottom: 0,
};

const descriptionStyles = {
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 600,
  fontSize: '.875rem',
  marginTop: '.5rem',
  marginBottom: 0,
};

function DashboardChangelog({ signals }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: theme.background(),
      }}
    >
      <div
        style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
      >
        <h1 style={titleStyles}>What{"'"}s New</h1>
        <div style={dateStyles}>June 28, 2018</div>
      </div>

      <div
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 2,
        }}
      />

      <p style={descriptionStyles}>Welcome to the new CodeSandbox!</p>

      <h2 style={subTitleStyles}>Dashboard</h2>

      <p style={descriptionStyles}>
        You can now manage your sandboxes in your own dashboard!
      </p>

      <p style={{ ...descriptionStyles, marginBottom: 0 }}>
        In the dashboard you can delete, update and organize many sandboxes at
        the same time. The dashboard looks very much like your local file
        system, you can create directories and organize sandboxes there. Make
        sure to keep an eye.
      </p>

      <h2 style={subTitleStyles}>Teams</h2>

      <p style={descriptionStyles}>
        You can now manage your sandboxes in your own dashboard!
      </p>

      <h2 style={subTitleStyles}>Free CodeSandbox Live</h2>

      <p style={descriptionStyles}>
        You can now manage your sandboxes in your own dashboard!
      </p>

      <div style={{ display: 'flex' }}>
        <Button
          style={{ marginTop: '1rem', marginRight: '.25rem' }}
          block
          small
          secondary
          onClick={() => {
            signals.modalClosed();
          }}
        >
          Close
        </Button>
        <Button style={{ marginTop: '1rem', marginLeft: '.25rem' }} block small>
          View Announcement
        </Button>
      </div>
    </div>
  );
}

export default inject('signals')(DashboardChangelog);
