import React from 'react'
import { Message } from 'semantic-ui-react'

export const ErrorMessage = ({
  message,
  subMessage,
  onDismiss
}) => (
  <Message
    icon='times circle'
    header={message}
    content={subMessage}
    onDismiss={onDismiss}
    negative
  />
);