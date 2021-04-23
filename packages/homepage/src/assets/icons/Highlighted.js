import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Highlighted = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={26} height={25} fill="none" viewBox="0 0 26 25" {...props}>
      <path
        fill={white}
        d="M12.376.458a.655.655 0 011.248 0l2.62 8.127c.087.272.34.457.624.457h8.474c.636 0 .9.821.386 1.198l-6.856 5.023a.665.665 0 00-.238.74l2.618 8.127c.197.61-.495 1.118-1.01.74l-6.856-5.022a.652.652 0 00-.772 0L5.758 24.87c-.514.377-1.207-.13-1.01-.74l2.618-8.128a.665.665 0 00-.238-.74L.272 10.24c-.515-.377-.25-1.198.386-1.198h8.474a.657.657 0 00.625-.457L12.376.458z"
      />
    </svg>
  );
};

export default Highlighted;
