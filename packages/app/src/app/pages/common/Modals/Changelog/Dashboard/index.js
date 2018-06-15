import React from 'react';
import theme from 'common/theme';

// Inline styles because styled-components didn't load the styles
const titleStyles = {
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.125rem',
  marginTop: 0,
};

const descriptionStyles = {
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 600,
  fontSize: '1rem',
};

function DashboardChangelog() {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: theme.background(),
      }}
    >
      <h1 style={titleStyles}>Update Day!</h1>

      <p style={descriptionStyles}>
        You can now manage your sandboxes with your own dashboard.
      </p>

      <p style={{ ...descriptionStyles, marginBottom: 0 }}>
        In the dashboard you can delete, update and organize many sandboxes at
        the same time. The dashboard looks very much like your local file
        system, you can create directories and organize sandboxes there. Make
        sure to keep an eye.
      </p>
    </div>
  );
}

export default DashboardChangelog;
