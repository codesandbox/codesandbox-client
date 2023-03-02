import { useEffect } from 'react';

const RedirectToProjects = () => {
  useEffect(() => {
    window.location.replace('https://projects.codesandbox.io');
  }, []);

  return null;
};

export default RedirectToProjects;
