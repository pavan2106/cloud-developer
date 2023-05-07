import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import ReactPlayer from 'react-player'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createVideo, deleteVideo, getVideos, patchVideo } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  newVideoName: string
  loadingVideos: boolean
}

export class Videos extends React.PureComponent<VideosProps, VideosState> {
  state: VideosState = {
    videos: [],
    newVideoName: '',
    loadingVideos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newVideoName: event.target.value })
  }

  onEditButtonClick = (videoId: string) => {
    this.props.history.push(`/videos/${videoId}/edit`)
  }

  onVideoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
    //  const dueDate = this.calculateDueDate()
      const newVideo = await createVideo(this.props.auth.getIdToken(), {
        title: this.state.newVideoName,
      })
      this.setState({
        videos: [...this.state.videos, newVideo],
        newVideoName: ''
      })
    } catch {
      alert('Video creation failed')
    }
  }

  onVideoDelete = async (videoId: string) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId !== videoId)
      })
    } catch {
      alert('Video deletion failed')
    }
  }

  onVideoCheck = async (pos: number) => {
    try {
      const video = this.state.videos[pos]
      await patchVideo(this.props.auth.getIdToken(), video.videoId, {
        title: video.title,
      })
      // this.setState({
      //   videos: update(this.state.videos, {
      //     [pos]: { done: { $set: !video.done } }
      //   })
      // })
    } catch {
      alert('Video deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const videos = await getVideos(this.props.auth.getIdToken())
      this.setState({
        videos,
        loadingVideos: false
      })
    } catch (e) {
      alert(`Failed to fetch videos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Videos</Header>

        {this.renderCreateVideoInput()}

        {this.renderVideos()}
      </div>
    )
  }

  renderCreateVideoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Video Title',
              onClick: this.onVideoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To add new Video..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderVideos() {
    if (this.state.loadingVideos) {
      return this.renderLoading()
    }

    return this.renderVideosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Videos
        </Loader>
      </Grid.Row>
    )
  }

  renderVideosList() {
    return (
      <Grid padded>
        {this.state.videos.map((video, pos) => {
          return (
            <Grid.Row key={video.videoId}>
              <Grid.Column width={1} verticalAlign="middle">
                {/* <Checkbox
                  onChange={() => this.onVideoCheck(pos)}
                  checked={video.done}
                /> */}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {video.title}
              </Grid.Column>
              {/* <Grid.Column width={3} floated="right">
                {video.dueDate}
              </Grid.Column> */}
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(video.videoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVideoDelete(video.videoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {video.url && (
                <ReactPlayer url={video.url} controls={true} />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
