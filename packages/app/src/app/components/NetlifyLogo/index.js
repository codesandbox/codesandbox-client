import React from 'react';
import IconBase from 'react-icons/IconBase';

function NetlifyLogo({ className }) {
  return (
    <IconBase className={className} viewBox="0 0 14 14">
      <defs>
        <path
          id="a"
          d="M7 .2l6 5.9c.2.2.2.7 0 1l-6 5.8c-.2.3-.7.3-1 0L.3 7.1a.7.7 0 0 1 0-1L6.1.2c.2-.3.7-.3 1 0z"
        />
      </defs>
      <use
        fill="#00AD9F"
        fillRule="evenodd"
        transform="translate(.4 .4)"
        xlinkHref="#a"
      />
    </IconBase>
  );
}

export default NetlifyLogo;
