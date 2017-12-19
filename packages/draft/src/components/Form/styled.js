import styled from 'react-emotion';
import { css } from 'emotion';
import theme from 'styles/theme';

export const Fields = styled.fieldset`
  display: block;
  max-width: 600px;
  width: 100%;
`;

export const Field = styled.p`
  display: block;
  margin: 10px 0 20px;
`;

export const FieldWrap = styled.div`
  display: block;
  margin: ${p => p.theme.padding}px 0;
  min-height: 120px;
`;

export const FieldName = styled.strong`
  display: block;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  line-height: 1.3;
  margin: 0 0 5px;
`;

const inputStyles = css`
  background-color: #fff;
  border: 1px solid ${theme.colors.detail};
  border-radius: 0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
  box-sizing: border-box;
  color: #32373c;
  font-size: 14px;
  outline: none;
  transition: 0.05s border-color ease-in-out;
`;

export const FieldSelect = styled.select`
  ${inputStyles};
  height: 28px;
  line-height: 28px;
  margin: 1px;
  max-width: 200px;
  padding: 2px;
  vertical-align: middle;

  &[multiple] {
    display: block;
    height: auto;
    width: 100%;
  }
`;

export const FieldInput = styled.input`
  ${inputStyles};
  display: block;
  height: 32px;
  padding: 3px 5px;
  width: 100%;

  &::placeholder {
    color: ${p => p.theme.colors.detail};
  }
`;

export const SizedInput = styled.input`
  ${inputStyles};
  display: block;
  height: 32px;
  padding: 3px 5px;
`;

export const fieldNumberClass = css`
  display: inline-block;
  height: 32px;
  padding: 3px 5px;
  width: 64px;
`;

export const FieldTextarea = styled.textarea`
  ${inputStyles};
  display: block;
  height: 4em;
  padding: 2px 6px;
  resize: vertical;
  width: 100%;
`;

export const FieldValue = styled.span`
  display: block;
  font-size: 14px;
  line-height: 1.4;
`;

export const FieldCheckbox = styled.input`
  appearance: none;
  background-color: ${p => p.theme.colors.white};
  border: 1px solid ${p => p.theme.colors.form.checkbox.border};
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  color: ${p => p.theme.colors.table.cell};
  cursor: pointer;
  display: inline-block;
  height: 16px;
  line-height: 0;
  min-width: 16px;
  outline: 0;
  padding: 0;
  transition: 0.05s border-color ease-in-out;
  vertical-align: text-top;
  width: 16px;

  &:checked {
    &::before {
      color: ${p => p.theme.colors.pink};
      content: '\f147';
      float: left;
      display: inline-block;
      font: normal 21px/1 dashicons;
      margin: -3px 0 0 -4px;
      speak: none;
      vertical-align: middle;
      width: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
`;

export const MessageWrap = styled.div`
  background: ${p => p.theme.colors.detail};
  border-left: 4px solid ${p => p.theme.colors.pink};
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  display: block;
  margin: 5px 0 15px;
  padding: 1px 38px 1px 12px;
  position: relative;
`;

export const MessageText = styled.p`
  font-size: 13px;
  line-height: 1.5;
  margin: 0.5em 0;
  padding: 2px;
`;

export const DismissButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 9px;
  position: absolute;
  right: 1px;
  top: 0;

  &::before {
    background: none;
    color: ${p => p.theme.colors.dark};
    content: '\f153';
    display: block;
    font: normal 16px/20px dashicons;
    height: 20px;
    speak: none;
    text-align: center;
    width: 20px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
