import React, { Component, Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import Loading from 'components/Loading';
import Message from 'components/Form/Message';
import Form from 'routes/Admin/Form';
import InfoBox from 'routes/Admin/InfoBox';
import { Heading, titleInputClass, FormWrap } from 'routes/Admin/styled';
import MediaAdminQuery from './MediaAdminQuery.graphql';
import UpdateMediaMutation from './UpdateMediaMutation.graphql';
import ImageInfo from './ImageInfo';
import AudioInfo from './AudioInfo';
import VideoInfo from './VideoInfo';
import { Audio, Video, CroppedImage } from './styled';

/* eslint-disable react/prop-types */

const mediaFields = [
  {
    prop: 'title',
    editable: true,
    className: titleInputClass,
    placeholder: 'Enter a title',
  },
  {
    render: media => {
      let mediaInfo = null;
      if (media.type === 'image') {
        let src;
        const imageCrop = media.crops.find(c => c.width === 300);
        if (imageCrop) {
          src = `/uploads/${media.destination}/${imageCrop.fileName}`;
        } else {
          src = `/uploads/${media.destination}/${media.fileName}`;
        }
        mediaInfo = <CroppedImage src={src} />;
      } else if (media.type === 'audio') {
        mediaInfo = <Audio controls src={`/uploads/${media.destination}/${media.fileName}`} />;
      } else if (media.type === 'video') {
        mediaInfo = (
          <Video
            preload="metadata"
            width={media.width}
            height={media.height}
            controls
            src={`/uploads/${media.destination}/${media.fileName}`}
          />
        );
      }
      return (
        <Fragment>
          <strong>Original name:</strong> {media.originalName}
          {mediaInfo}
        </Fragment>
      );
    },
  },
  {
    label: 'Description',
    prop: 'description',
    type: 'textarea',
    editable: true,
    condition: media => media.type !== 'image',
  },
  {
    label: 'Caption',
    prop: 'caption',
    type: 'textarea',
    editable: true,
    condition: media => media.type === 'image',
  },
  {
    label: 'Alternative Text',
    prop: 'altText',
    editable: true,
    condition: media => media.type === 'image',
  },
];

class EditMedia extends Component {
  state = {
    message: null,
  };

  onSubmit = (e, updates) => {
    e.preventDefault();

    const input = Object.assign({}, updates);

    const { media } = this.props.data;
    this.props
      .mutate({
        variables: {
          id: media.id,
          input,
        },
      })
      .then(() => {
        this.setState({ message: 'updated' });
        document.documentElement.scrollTop = 0;
      })
      .catch(() => this.setState({ message: 'error' }));
  };

  render() {
    const { data: { loading, media } } = this.props;

    if (loading && !media) {
      return <Loading />;
    }

    let mediaInfo = null;
    if (media.type === 'audio') {
      mediaInfo = <AudioInfo media={media} />;
    } else if (media.type === 'video') {
      mediaInfo = <VideoInfo media={media} />;
    } else if (media.type === 'image') {
      mediaInfo = <ImageInfo media={media} />;
    }

    return (
      <Fragment>
        <Heading>Edit Media</Heading>
        {this.state.message === 'updated' && <Message text="Media updated." />}
        <FormWrap>
          <Form
            fields={mediaFields}
            data={media}
            buttonLabel="Update Media"
            onSubmit={this.onSubmit}
          />
          <InfoBox label="Media Details">{mediaInfo}</InfoBox>
        </FormWrap>
      </Fragment>
    );
  }
}

const composed = compose(
  graphql(MediaAdminQuery, {
    options: ({ match: { params } }) => ({
      variables: { id: params.id },
    }),
  }),
  graphql(UpdateMediaMutation)
);

export default composed(EditMedia);
