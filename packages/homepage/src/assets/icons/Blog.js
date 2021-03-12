import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Blog = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={16} height={25} fill="none" viewBox="0 0 16 25" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M6.79 8.17V0L0 11.343l3.395 8.101h8.487l3.395-8.101L8.487 0v8.17a2.547 2.547 0 11-1.697 0zm8.487 12.663H-.001V25h15.278v-4.167z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Blog;
