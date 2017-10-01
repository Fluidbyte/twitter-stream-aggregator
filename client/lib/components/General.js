import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import socket from '../socket'

export default class General extends React.Component {
  constructor (props, ctx) {
    super(props)

    this.state = {
      start: Date.now(),
      total: 0,
      perSec: 0,
      perMinute: 0,
      perHour: 0,
      hasEmojis: 0,
      emojis: 0,
      hasHashtags: 0,
      hashtags: 0,
      hasLinks: 0,
      links: 0,
      hasPhotos: 0,
      photos: 0
    }
  }

  componentDidMount () {
    socket.on('twitter', this.calculateStats.bind(this))
  }

  calculateStats (data) {
    const curTime = Date.now()
    const curStats = Object.assign({}, this.state)

    // Inc total
    const total = curStats.total + 1

    // Calculate time-based stats
    const rawPerSec = total / ((curTime - curStats.start) / 1000)

    const newData = {
      total,

      // Time-based
      perSec: Math.ceil(rawPerSec),
      perMinute: Math.ceil(rawPerSec * 60),
      perHour: Math.ceil(rawPerSec * 3600),

      // Emojis
      hasEmojis: data.emojis.length ? curStats.hasEmojis + 1 : curStats.hasEmojis,
      emojis: data.emojis.length ? curStats.emojis + data.emojis.length : curStats.emojis,

      // Hashtags
      hasHashtags: data.hashtags.length ? curStats.hasHashtags + 1 : curStats.hasHashtags,
      hashtags: data.hashtags.length ? curStats.hashtags + data.hashtags.length : curStats.hashtags,

      // Links
      hasLinks: data.urls.length ? curStats.hasLinks + 1 : curStats.hasLinks,
      links: data.urls.length ? curStats.links + data.urls.length : curStats.links,

      // Photos
      hasPhotos: data.urls.length ? curStats.hasPhotos + 1 : curStats.hasPhotos,
      photos: data.photos.length ? curStats.photos + data.photos.length : curStats.photos
    }

    // Set state
    this.setState(newData)
  }

  render () {
    return (
      <ListGroup>
        <ListGroupItem>
          <strong>{this.state.total}</strong> Tweets
        </ListGroupItem>
        <ListGroupItem>
          <ul className='list-time-stats'>
            <li>
              <strong>{this.state.perSec}</strong>/sec
            </li>
            <li>
              <strong>{this.state.perMinute}</strong>/min
            </li>
            <li>
              <strong>{this.state.perHour}</strong>/hr
            </li>
          </ul>
        </ListGroupItem>
        <ListGroupItem>
          <strong>{this.state.emojis}</strong> Emojis
          ({ Math.ceil((this.state.emojis / this.state.total) * 100) || 0 }%)
        </ListGroupItem>
        <ListGroupItem>
          <strong>{this.state.hashtags}</strong> Hashtags
          ({ Math.ceil((this.state.hashtags / this.state.total) * 100) || 0 }%)
        </ListGroupItem>
        <ListGroupItem>
          <strong>{this.state.links}</strong> Links
          ({ Math.ceil((this.state.links / this.state.total) * 100) || 0 }%)
        </ListGroupItem>
        <ListGroupItem>
          <strong>{this.state.photos}</strong> Images
          ({ Math.ceil((this.state.photos / this.state.total) * 100) || 0 }%)
        </ListGroupItem>
      </ListGroup>
    )
  }
}
