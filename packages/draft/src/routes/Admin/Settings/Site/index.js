import React from 'react';
import { compose, graphql } from 'react-apollo';
import Form from '../Form';
import SiteSettingsQuery from './SiteSettingsQuery.graphql';
import SiteSettingsMutation from './SiteSettingsMutation.graphql';

/* eslint-disable react/prop-types */

const settingsFields = [
  { label: 'Site Title', prop: 'siteTitle', editable: true },
  { label: 'Tagline', prop: 'tagline', editable: true },
  { label: 'Site URL', inputType: 'url', prop: 'siteUrl', editable: true },
  {
    label: 'Email Address',
    inputType: 'email',
    prop: 'emailAddress',
    editable: true,
  },
  {
    label: 'Site Language',
    prop: 'language',
    editable: true,
    type: 'select',
    choices: [{ value: 'en-US', label: 'English (United States)' }],
  },
  {
    label: 'Copyright Text',
    prop: 'copyrightText',
    editable: true,
    type: 'textarea',
  },
];

function SiteSettings({ data, mutate }) {
  return <Form id="site" title="General Settings" {...{ settingsFields, data, mutate }} />;
}

const composed = compose(graphql(SiteSettingsQuery), graphql(SiteSettingsMutation));

export default composed(SiteSettings);
