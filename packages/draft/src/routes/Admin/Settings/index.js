import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Site from './Site';
import Social from './Social';

export default function SettingsRouter() {
  return (
    <Switch>
      <Route path="/settings/site" component={Site} />
      <Route path="/settings/social" component={Social} />
      <Route path="/settings" component={Site} />
    </Switch>
  );
}
