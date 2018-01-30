import { css } from 'emotion';
import styled from 'react-emotion';
import theme from 'styles/theme';
import { Link } from 'react-router-dom';

export const AtomicToolbar = styled.div`
  position: absolute;
`;

export const PageWrapper = styled.div`
  background: ${theme.colors.white};
  margin: 0 auto;
  min-height: calc(100vh - ${theme.padding * 2}px);
  padding: ${theme.padding}px ${theme.padding * 2}px;
`;

export const Header = styled.header`
  padding: ${theme.padding}px 0;
`;

export const titleInputClass = css`
  font-size: 22px;
  line-height: 1;
  height: 38px;
  padding: 3px 8px;
`;

export const Heading = styled.h1`
  color: ${theme.colors.dark};
  display: inline-block;
  font-family: ${theme.fonts.futura};
  font-size: 23px;
  font-weight: normal;
  letter-spacing: 0.3px;
  line-height: 1.3;
  margin: 0 9px 0 0;
  padding: 9px 0 4px 0;
`;

export const HeaderAdd = styled(Link)`
  background: ${theme.colors.detail};
  border: 1px solid ${theme.colors.background};
  border-radius: 2px;
  color: ${theme.colors.dark};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${theme.fonts.weight.bold};
  line-height: normal;
  outline: 0;
  padding: 4px 8px;
  position: relative;
  text-decoration: none;
  text-shadow: none;
  top: -3px;
  z-index: 1;
`;

export const Line = styled.br`
  display: block;
`;

export const Flex = styled.section``;

export const Content = styled.section`
  height: 100%;
  margin-left: 160px;
  padding: 0 20px 65px;
  position: relative;
  z-index: 3;

  @media screen and (max-width: 782px) {
    margin-left: 36px;
  }
`;

export const collapsedNavClass = css`
  margin-left: 36px;
`;

export const FormWrap = styled.div`
  display: block;
  margin-right: 300px;

  &::after {
    clear: both;
    content: ' ';
    display: table;
  }

  @media screen and (max-width: 782px) {
    margin-right: 0;
  }
`;
