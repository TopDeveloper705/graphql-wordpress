import React, { Component } from 'react';
import { Field, FieldName, FieldValue, Fields } from 'components/Form/styled';
import Input from 'components/Form/Input';
import Textarea from 'components/Form/Textarea';
import Select from 'components/Form/Select';
import { Button } from './styled';

/* eslint-disable react/prop-types */

export default class Form extends Component {
  boundRefs = {};

  bindRef = prop => ref => {
    this.boundRefs[prop] = ref;
  };

  onSubmit = e => {
    e.preventDefault();
    e.target.blur();

    const { fields, onSubmit } = this.props;

    const updates = fields.reduce((memo, field) => {
      if (field.editable) {
        const prop = this.boundRefs[field.prop];
        if (field.type === 'select' && field.multiple) {
          memo[field.prop] = [...prop.selectedOptions].map(o => o.value);
        } else {
          memo[field.prop] = prop.value;
        }
      }
      return memo;
    }, {});

    onSubmit(e, updates);
  };

  getEditableField(field, data = {}) {
    if (field.type === 'select') {
      return (
        <Select
          innerRef={this.bindRef(field.prop)}
          choices={field.choices}
          value={data[field.prop] || (field.multiple ? [] : '')}
          multiple={field.multiple}
        >
          {field.render ? field.render(data) : null}
        </Select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          rows="3"
          innerRef={this.bindRef(field.prop)}
          value={field.render ? field.render(data) : data[field.prop]}
        />
      );
    }

    return (
      <Input
        innerRef={this.bindRef(field.prop)}
        value={field.render ? field.render(data) : data[field.prop]}
      />
    );
  }

  render() {
    const { data = {}, fields, buttonLabel = 'Submit' } = this.props;

    return (
      <Fields>
        {fields.map(field => (
          <Field key={field.prop}>
            <FieldName>{field.label}</FieldName>
            {field.editable ? (
              this.getEditableField(field, data)
            ) : (
              <FieldValue>{(field.render && field.render(data)) || data[field.prop]}</FieldValue>
            )}
          </Field>
        ))}
        <Button onClick={this.onSubmit}>{buttonLabel}</Button>
      </Fields>
    );
  }
}
