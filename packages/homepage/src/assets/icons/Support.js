import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Support = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={36} height={24} fill="none" viewBox="0 0 36 24" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M0 10.154v10.154h10.154c5.608 0 10.154-4.546 10.154-10.154S15.762 0 10.154 0 0 4.546 0 10.154zm10.338 2.056H8.351v-.178c.005-1.836.498-2.397 1.379-2.953.645-.409 1.143-.865 1.143-1.552 0-.73-.571-1.201-1.28-1.201-.687 0-1.321.456-1.353 1.31H6.1c.048-2.097 1.6-3.094 3.504-3.094 2.082 0 3.561 1.07 3.561 2.906 0 1.233-.64 2.004-1.62 2.586-.83.498-1.196.975-1.207 1.998v.178zm.305 2.098a1.276 1.276 0 01-1.26 1.259 1.253 1.253 0 110-2.507c.672 0 1.254.561 1.26 1.248z"
        clipRule="evenodd"
      />
      <path
        fill={white}
        fillOpacity={0.4}
        fillRule="evenodd"
        d="M17.843 19.369a11.975 11.975 0 004.312-9.215c0-1.249-.19-2.454-.545-3.586a9.23 9.23 0 0113.469 8.31v9.122H25.849a9.227 9.227 0 01-8.006-4.631z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Support;
