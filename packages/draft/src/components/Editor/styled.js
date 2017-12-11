import styled from 'react-emotion';
import { css } from 'emotion';
import { headingStyles } from 'styles/utils';
import theme from 'styles/theme';

export const styleButtonClass = css`
  cursor: pointer;
  display: inline-block;
  height: 100%;
  padding: 2px 6px;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    color: ${theme.colors.black};
  }
`;

export const activeButtonClass = css`
  color: ${theme.colors.pink};

  &:hover {
    color: ${theme.colors.pink};
  }
`;

export const hidePlaceholderClass = css`
  .public-DraftEditorPlaceholder-root {
    display: none;
  }
`;

export const Controls = styled.div`
  font-size: 14px;
  user-select: none;
`;

export const EditorWrap = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  font-size: 14px;
  padding: 15px;
`;

export const linkClass = css`
  color: ${theme.colors.pink};
  text-decoration: underline;
`;

export const blockquoteClass = css`
  border-left: 5px solid #eee;
  color: #666;
  font-family: 'Georgia', serif;
  font-style: italic;
  margin: 16px 0;
  padding: 10px 20px;
`;

export const RichEditor = styled.div`
  border-top: 1px solid #ddd;
  cursor: text;
  font-size: 16px;
  margin-top: 10px;
  position: relative;
  z-index: 1;

  h1 {
    ${headingStyles};
  }

  h2 {
    ${headingStyles};
    font-size: 24px;
  }

  h3 {
    ${headingStyles};
    font-size: 20px;
  }

  h4 {
    ${headingStyles};
    font-size: 18px;
  }

  .public-DraftEditorPlaceholder-root,
  .public-DraftEditor-content {
    margin: 0 -15px -15px;
    padding: 15px;
  }

  .public-DraftEditor-content {
    min-height: 100px;
  }

  .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    padding: 20px;
  }
`;
