import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { LatestWrap, LatestItem, Title, Paragraph, FeaturedImage } from './styled';

/* eslint-disable react/prop-types */

function Latest({ data: { loading, posts } }) {
  if (loading && !posts) {
    return null;
  }

  return (
    <LatestWrap>
      {posts.edges.map(({ node }) => (
        <LatestItem key={node.id}>
          <Title>
            <Link to={`/post/${node.slug}`}>{node.title}</Link>
          </Title>
          {node.featuredMedia &&
            node.featuredMedia.map(media => {
              const crop = media.crops.find(c => c.width === 300);
              return (
                <FeaturedImage
                  key={crop.fileName}
                  alt=""
                  src={`/uploads/${media.destination}/${crop.fileName}`}
                />
              );
            })}
          <Paragraph>{node.summary}</Paragraph>
        </LatestItem>
      ))}
    </LatestWrap>
  );
}

const composed = graphql(gql`
  query LatestPostsQuery {
    posts(first: 2) {
      edges {
        node {
          id
          slug
          title
          summary
          featuredMedia {
            destination
            ... on ImageUpload {
              crops {
                fileName
                width
              }
            }
          }
        }
      }
    }
  }
`);

export default composed(Latest);
