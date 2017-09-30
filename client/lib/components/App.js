import React from 'react'
import TitleBar from './TitleBar'
import Stream from './Stream'
import { Grid, Row, Col, Panel } from 'react-bootstrap'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <TitleBar />
        <Grid>
          <Row>
            <Col md={3}>
              <Panel>
                <h2><i className='fa fa-info-circle' />General</h2>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel>
                <h2><i className='fa fa-smile-o' />Emojis</h2>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel>
                <h2><i className='fa fa-hashtag' />Hashtags</h2>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel>
                <h2><i className='fa fa-globe' />Links</h2>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Panel>
                <h2><i className='fa fa-cog fa-spin' />Stream</h2>
                <Stream />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
