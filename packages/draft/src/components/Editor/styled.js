import styled from 'react-emotion';
import { css } from 'emotion';
import { headingStyles } from 'styles/utils';
import theme from 'styles/theme';

export const hidePlaceholderClass = css`
  .public-DraftEditorPlaceholder-root {
    display: none;
  }
`;

export const BlockButton = styled.div`
  color: ${p => p.theme.colors.detail};
  cursor: pointer;
  display: block;
  font-size: 24px;
  left: -30px;
  position: absolute;
  transform: scale(0);
  transition: transform 0.25s cubic-bezier(0.3, 1.2, 0.2, 1);

  &:hover {
    color: ${p => p.theme.colors.dark};
  }
`;

export const EditorWrap = styled.div`
  background: #fff;
  position: relative;
`;

export const linkClass = css`
  color: ${theme.colors.pink};
  text-decoration: underline;
`;

export const RichEditor = styled.div`
  cursor: text;
  font-size: 16px;
  position: relative;
  z-index: 1;

  h2[data-offset-key] {
    ${headingStyles};
    font-size: 24px;
  }

  h3[data-offset-key] {
    ${headingStyles};
    font-size: 20px;
  }

  h4[data-offset-key] {
    ${headingStyles};
    font-size: 18px;
  }

  .public-DraftEditor-content {
    min-height: 100px;
  }

  .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    margin: 20px 0;
    padding: 20px;
  }

  .public-DraftStyleDefault-unorderedListItem,
  .public-DraftStyleDefault-orderedListItem {
    margin: 0;
  }

  ol,
  ul {
    margin: 20px 0 20px 32px;
  }
`;

export const Toolbar = styled.div`
  background: ${p => p.theme.colors.white};
  border-radius: 4px;
  box-shadow: 0 1px 18px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  transform: scale(0);
  transition: transform 0.1s cubic-bezier(0.3, 1.2, 0.2, 1);
  z-index: 10;

  &::after {
    border: 6px solid transparent;
    border-top-color: ${p => p.theme.colors.white};
    content: ' ';
    height: 0;
    position: absolute;
    pointer-events: none;
    right: 50%;
    bottom: -12px;
    width: 0;
  }

  &.Toolbar-sidebar {
    left: -28px;

    &::after {
      left: 4px;
      right: auto;
    }
  }

  &.Toolbar-flush {
    &::after {
      border-top-color: transparent;
    }
  }
`;
