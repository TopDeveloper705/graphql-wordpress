import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormWrap } from 'routes/Admin/styled';
import Form from 'routes/Admin/Settings/Form';
import Crops from './Crops';
import MediaSettingsQuery from './MediaSettingsQuery.graphql';
import MediaSettingsMutation from './MediaSettingsMutation.graphql';

/* eslint-disable react/prop-types */

const normalizeCrops = crops =>
  crops.map(({ name, width, height }) => ({
    name,
    width,
    height,
  }));

let cropsValue;
const updateCrops = crops => {
  cropsValue = normalizeCrops(crops);
};

const settingsFields = [
  {
    label: 'Crop Sizes',
    prop: 'crops',
    editable: true,
    type: 'custom',
    value: () => cropsValue.filter(({ name, width, height }) => name && (width || height)),
    render: settings => {
      cropsValue = normalizeCrops(settings.crops) || [{}];
      return <Crops onUpdate={updateCrops} settings={settings} />;
    },
  },
];

function MediaSettings({ data, mutate }) {
  return (
    <FormWrap>
      <Form id="media" title="Media Settings" {...{ settingsFields, data, mutate }} />
    </FormWrap>
  );
}

const composed = compose(graphql(MediaSettingsQuery), graphql(MediaSettingsMutation));

export default composed(MediaSettings);
