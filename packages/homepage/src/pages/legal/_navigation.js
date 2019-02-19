import React from 'react';
import { NavigationLink, LegalNavigation } from './_elements';

export default () => (
  <LegalNavigation>
    <NavigationLink to="/legal/terms" activeClassName="active">
      Terms and Conditions
    </NavigationLink>

    <NavigationLink to="/legal/privacy" activeClassName="active">
      Privacy Policy
    </NavigationLink>
  </LegalNavigation>
);
