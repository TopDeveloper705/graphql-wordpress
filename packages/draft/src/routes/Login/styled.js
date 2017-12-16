import styled from 'react-emotion';

export const PageWrapper = styled.div`
  background: ${p => p.theme.colors.white};
  display: block;
  min-height: 100vh;
`;

export const Content = styled.div`
  margin: auto;
  padding: 8% 0 0;
  width: 320px;
`;

export const Title = styled.h1`
  display: block;
  font-family: ${p => p.theme.fonts.futura};
  font-size: 54px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 54px;
  margin: 0 0 12px;
`;

export const Form = styled.form`
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.13);
  display: block;
  font-size: 14px;
  margin-top: 20px;
  padding: 26px 24px 46px;
`;

export const Label = styled.label`
  letter-spacing: 0.2px;
`;

export const Input = styled.input`
  background: #fbfbfb;
  border: 1px solid #ddd;
  border-radius: 0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
  box-sizing: border-box;
  color: ${p => p.theme.colors.dark};
  font-size: 24px;
  margin: 2px 6px 16px 0;
  outline: none;
  padding: 3px;
  transition: 0.05s border-color ease-in-out;
  width: 100%;

  &:focus {
    border-color: ${p => p.theme.colors.pink};
    box-shadow: 0 0 2px rgba(229, 0, 130, 0.8);
  }
`;

export const Button = styled.button`
  apperance: none;
  background: ${p => p.theme.colors.white};
  border: 1px solid ${p => p.theme.colors.detail};
  border-radius: 3px;
  box-sizing: border-box;
  color: ${p => p.theme.colors.dark};
  cursor: pointer;
  font-size: 13px;
  height: 30px;
  line-height: 28px;
  padding: 0 12px 2px;
  vertical-align: baseline;
`;
