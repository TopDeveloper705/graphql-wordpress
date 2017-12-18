import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import cn from 'classnames';
import { Field, FieldWrap, FieldName, FieldValue, Fields } from 'components/Form/styled';
import Input from 'components/Form/Input';
import Textarea from 'components/Form/Textarea';
import Select from 'components/Form/Select';
import Editor from 'components/Editor';
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
        if (!prop) {
          memo[field.prop] = field.value();
        } else if (field.type === 'select' && field.multiple) {
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
    if (field.type === 'editor') {
      return (
        <Editor
          className={cn(field.className)}
          onChange={content => {
            const converted = convertToRaw(content);
            const value = {
              blocks: [...converted.blocks],
              entityMap: { ...converted.entityMap },
            };
            const entityMap = Object.keys(value.entityMap)
              .sort()
              .map(i => {
                const entity = Object.assign({}, value.entityMap[i]);
                // Input types cannot be unions, so all fields from all
                // entity data input types have to exist when setting
                // data for entities
                const entityData = Object.assign({}, entity.data);
                entityData.type = entity.type;
                delete entityData.__typename;
                ['url', 'html', 'href', 'target'].forEach(key => {
                  if (!entityData[key]) {
                    entityData[key] = '';
                  }
                });
                return {
                  ...entity,
                  data: entityData,
                };
              });
            value.entityMap = entityMap;
            this.boundRefs[field.prop] = {
              value,
            };
          }}
          editorKey={field.prop}
          content={data && field.render ? field.render(data) : data[field.prop]}
          placeholder={field.placeholder || 'Content goes here...'}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <Select
          className={cn(field.className)}
          innerRef={this.bindRef(field.prop)}
          choices={field.choices}
          value={data[field.prop] || (field.multiple ? [] : '')}
          multiple={field.multiple || false}
        >
          {data && field.render ? field.render(data) : null}
        </Select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          className={cn(field.className)}
          rows="4"
          innerRef={this.bindRef(field.prop)}
          value={data && field.render ? field.render(data) : data[field.prop]}
        />
      );
    }

    return (
      <Input
        type={field.inputType || 'text'}
        className={cn(field.className)}
        innerRef={this.bindRef(field.prop)}
        value={data && field.render ? field.render(data) : data[field.prop]}
      />
    );
  }

  render() {
    const { data = {}, fields, buttonLabel = 'Submit' } = this.props;

    return (
      <Fields>
        {fields.map(field => {
          if (field.type === 'custom') {
            return (
              <FieldWrap key={field.prop}>
                {field.label && <FieldName>{field.label}</FieldName>}
                {field.render(data)}
              </FieldWrap>
            );
          }

          if (field.type === 'editor') {
            return (
              <FieldWrap key={field.prop}>
                {field.label && <FieldName>{field.label}</FieldName>}
                {this.getEditableField(field, data)}
              </FieldWrap>
            );
          }

          return (
            <Field key={field.prop}>
              {field.label && <FieldName>{field.label}</FieldName>}
              {field.editable ? (
                this.getEditableField(field, data)
              ) : (
                <FieldValue>{(field.render && field.render(data)) || data[field.prop]}</FieldValue>
              )}
            </Field>
          );
        })}
        <Button onClick={this.onSubmit}>{buttonLabel}</Button>
      </Fields>
    );
  }
}
