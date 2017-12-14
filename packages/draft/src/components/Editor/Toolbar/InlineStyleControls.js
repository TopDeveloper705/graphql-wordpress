import React, { Component, Fragment } from 'react';
import { RichUtils, EditorState } from 'draft-js';
import { LinkInput, LinkAction } from './styled';
import StyleButton from '../StyleButton';
import { Controls } from '../styled';

/* eslint-disable react/prop-types */

const INLINE_STYLES = [
  { label: '', style: 'BOLD', className: 'dashicons dashicons-editor-bold' },
  {
    label: '',
    style: 'ITALIC',
    className: 'dashicons dashicons-editor-italic',
  },
  {
    label: '',
    style: 'UNDERLINE',
    className: 'dashicons dashicons-editor-underline',
  },
  {
    label: '',
    style: 'STRIKETHROUGH',
    className: 'dashicons dashicons-editor-strikethrough',
  },
  {
    label: (
      <Fragment>
        X<sup>2</sup>
      </Fragment>
    ),
    style: 'SUPERSCRIPT',
    className: '',
  },
  {
    label: (
      <Fragment>
        X<sub>2</sub>
      </Fragment>
    ),
    style: 'SUBSCRIPT',
    className: '',
  },
  { label: '', style: 'CODE', className: 'dashicons dashicons-editor-code' },
  { label: '', style: 'LINK', className: 'dashicons dashicons-admin-links' },
];

export default class InlineStyleControls extends Component {
  state = {
    mode: '',
    urlValue: '',
  };

  // event propagation is already handled
  showLink = () => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    const contentState = editorState.getCurrentContent();
    const blockWithLink = contentState.getBlockForKey(selection.getStartKey());
    const linkKey = blockWithLink.getEntityAt(selection.getStartOffset());

    let urlValue = '';
    let mode = 'ADD_LINK';
    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      urlValue = linkInstance.getData().url;
      mode = 'EDIT_LINK';
    }

    this.setState(
      {
        mode,
        urlValue,
      },
      () => {
        setTimeout(() => this.linkInput.focus(), 0);
      }
    );
  };

  addLink = e => {
    e.preventDefault();
    const { editorState } = this.props;
    const { urlValue } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: urlValue });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const selection = editorState.getSelection();
    const newEditorState = RichUtils.toggleLink(editorState, selection, entityKey);
    const selectionState = EditorState.forceSelection(newEditorState, selection);

    this.setState(
      {
        mode: '',
        urlValue: '',
      },
      () => {
        this.props.onChange(selectionState);
      }
    );
  };

  removeLink = e => {
    e.preventDefault();
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }

    this.setState({ mode: '' }, () => {
      const newEditorState = RichUtils.toggleLink(editorState, selection, null);
      const selectionState = EditorState.forceSelection(newEditorState, selection);
      this.props.onChange(selectionState);
    });
  };

  cancelLink = e => {
    e.preventDefault();

    this.setState({ mode: '' });
  };

  onLinkInputChange = e => {
    this.setState({ urlValue: e.target.value });
  };

  onLinkInputKeyDown = e => {
    if (e.which === 13) {
      this.addLink(e);
    }
  };

  onLinkInputMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { editorState, onToggle } = this.props;
    const currentStyle = editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();
    let linkKey = null;
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const blockWithLink = contentState.getBlockForKey(selection.getStartKey());
      linkKey = blockWithLink.getEntityAt(selection.getStartOffset());
    }

    return (
      <Controls>
        {['ADD_LINK', 'EDIT_LINK'].includes(this.state.mode) ? (
          <Fragment>
            <LinkInput
              innerRef={linkInput => {
                this.linkInput = linkInput;
              }}
              placeholder="Type a URL and press Enter"
              value={this.state.urlValue}
              onChange={this.onLinkInputChange}
              onKeyDown={this.onLinkInputKeyDown}
              onMouseDown={this.onLinkInputMouseDown}
              onClick={this.onLinkInputMouseDown}
              type="text"
            />
            {this.state.mode === 'EDIT_LINK' && (
              <LinkAction className="dashicons dashicons-editor-unlink" onClick={this.removeLink} />
            )}
            {this.state.mode === 'ADD_LINK' && (
              <LinkAction className="dashicons dashicons-no-alt" onClick={this.cancelLink} />
            )}
          </Fragment>
        ) : (
          INLINE_STYLES.map(type => (
            <StyleButton
              key={type.style}
              className={type.className}
              active={currentStyle.has(type.style) || (type.style === 'LINK' && linkKey)}
              label={type.label}
              onToggle={type.style === 'LINK' ? this.showLink : onToggle}
              style={type.style}
            />
          ))
        )}
      </Controls>
    );
  }
}
