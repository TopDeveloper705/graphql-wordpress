import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Message from 'components/Form/Message';
import Form from '../Form';
import { Heading } from '../styled';

/* eslint-disable react/prop-types */

const postFields = [
  { label: 'Title', prop: 'title', editable: true },
  {
    label: 'Content',
    prop: 'content',
    type: 'editor',
    editable: true,
    placeholder: 'Post goes here...',
  },
];

@graphql(gql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      slug
      content
      tags {
        name
        slug
      }
    }
  }
`)
export default class AddPost extends Component {
  state = {
    message: null,
  };

  onSubmit = (e, updates) => {
    e.preventDefault();

    const input = Object.assign({}, updates);
    input.content = JSON.stringify(updates.content);

    this.props
      .mutate({
        variables: {
          input,
        },
      })
      .then(({ data: { createPost } }) => {
        this.props.history.push({
          pathname: `/post/${createPost.id}`,
        });
      })
      .catch(() => this.setState({ message: 'error' }));
  };

  render() {
    return (
      <Fragment>
        <Heading>Add Post</Heading>
        {this.state.message === 'error' && <Message text="Error adding post." />}
        <Form fields={postFields} buttonLabel="Add Post" onSubmit={this.onSubmit} />
      </Fragment>
    );
  }
}
