import { REDESIGNED_SIDEBAR } from '@codesandbox/common/lib/utils/feature-flags';
import React, { useState, useEffect } from 'react';

import { SubDescription, PaddedPreference } from '../elements';

export const NewSidebar: React.FunctionComponent = () => {
  const [newSidebar, setNewSidebar] = useState(false);
  useEffect(() => {
    if (REDESIGNED_SIDEBAR === 'true') {
      return setNewSidebar(true);
    }
    return setNewSidebar(false);
  }, []);

  const setValue = (val: boolean) => {
    setNewSidebar(val);
    window.localStorage.setItem('REDESIGNED_SIDEBAR', val.toString());
    location.reload();
  };

  return (
    <>
      <PaddedPreference
        title="Sidebar Redesign"
        type="boolean"
        value={newSidebar}
        setValue={setValue}
      />
      <SubDescription>
        This will refresh the page, make sure to save your changes.
      </SubDescription>
    </>
  );
};
