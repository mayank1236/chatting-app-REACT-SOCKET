import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useContacts } from '../context/ContactsContext'
import { useConversations } from '../context/ConversationsContext'


export const NewConversationModal = ({ closeModal }: {closeModal: () => void}) => {
    const { contacts } = useContacts()
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
    const {createConversation} = useConversations()

    function handleSubmit(e: React.SyntheticEvent) {
      e.preventDefault()

      createConversation(selectedContactIds)

      closeModal()
    }

    function handleCheckboxChange(contactId: string) {
      setSelectedContactIds(prevSelectedContactIds => {
        if (prevSelectedContactIds.includes(contactId)) {
          return prevSelectedContactIds.filter(prevId => {
            return contactId !== prevId
          })
        } else {
          return [...prevSelectedContactIds, contactId]
        }
      })
    }

    return (
      <>
        <Modal.Header closeButton>Create Conversation</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {contacts.map(contact => (
              <Form.Group controlId={String(contact.id)} key={contact.id}>
                <Form.Check 
                  type="checkbox"
                  value={selectedContactIds.includes(String(contact.id))? 0 : 1}
                  label={contact.name}
                  onChange={() => handleCheckboxChange(String(contact.id))}
                />
              </Form.Group>
            ))}
            <Button className="mt-2" type="submit">Create</Button>
          </Form>
        </Modal.Body>
      </>
    )
}
