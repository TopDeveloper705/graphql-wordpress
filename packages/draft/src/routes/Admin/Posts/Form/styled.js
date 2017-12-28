import styled from 'react-emotion';
import { css } from 'emotion';
import { h1styles, buttonStyles, buttonColors } from 'styles/utils';

export const postTitleClass = css`
  ${h1styles};
  border: 0 none;
  box-shadow: none;
  height: 47px;
  margin: 0;
  padding: 0;
`;

export const FeaturedImage = styled.img`
  display: block;
  height: auto;
  margin: 0 10px 10px 0;
  max-width: 100%;
`;

export const ViewPost = styled.a`
  ${buttonStyles};
  ${buttonColors};
`;
