import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { contact, useContacts } from '../context/ContactsContext'

export const Contacts = () => {
  const { contacts } = useContacts()

  return (
    <ListGroup variant="flush">
      {contacts.map((contact: contact) => (
        <ListGroup.Item key={contact.id}>
          {contact.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
