import React from 'react'
import { Dimmer, Header, Icon } from 'semantic-ui-react'

export const ErrorOverlay = ({ errorMessage, subMessage }) => (
  <Dimmer page>
    <Header as='h2' icon inverted>
      <Icon name='frown outline' />
      {errorMessage}
      {subMessage ? <Header.Subheader>{subMessage}</Header.Subheader> : <></>}
    </Header>
  </Dimmer>
)
