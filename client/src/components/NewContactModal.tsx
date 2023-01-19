import React, { useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

import { useContacts } from '../context/ContactsContext'

export const NewContactModal = ({ closeModal }: {closeModal: () => void}) => {
  const idRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const { createContact } = useContacts()

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    createContact(idRef.current?.value, nameRef.current?.value)
    closeModal()
  }

  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Button className="mt-2" type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  )
}
