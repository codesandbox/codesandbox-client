import React from 'react';
import { NavigationLink, LegalNavigation } from './_elements';

export default () => (
  <LegalNavigation>
    <NavigationLink to="/legal/terms" activeClassName="active">
      TERMS AND CONDITIONS
    </NavigationLink>

    <NavigationLink to="/legal/privacy" activeClassName="active">
      PRIVACY POLICY
    </NavigationLink>
  </LegalNavigation>
);
