import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Pricing = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16zm-.518-9.227c-3.144-.175-4.423-1.923-4.492-3.77h2.852c.088.684.664 1.26 1.64 1.436V17.49l-.927-.205c-1.983-.4-3.31-1.484-3.31-3.535 0-2.217 1.698-3.652 4.237-3.857V8.437h1.104v1.456c2.783.166 4.238 1.835 4.307 3.662h-2.774c-.078-.645-.605-1.23-1.533-1.387v2.783l1.113.225c1.904.38 3.408 1.318 3.408 3.594 0 2.216-1.552 3.808-4.521 3.994v1.455h-1.104v-1.446zm0-10.585c-.82.175-1.25.693-1.25 1.347 0 .567.45.947 1.25 1.172v-2.52zm1.104 8.28c1.064-.116 1.582-.683 1.582-1.396 0-.722-.537-1.084-1.582-1.347v2.744z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Pricing;
