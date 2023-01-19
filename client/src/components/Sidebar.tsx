import React, { useState } from 'react'
import { Button, Modal, Nav, Tab } from 'react-bootstrap'
import { Contacts } from './Contacts'
import { Conversations } from './Conversations'
import { NewContactModal } from './NewContactModal'
import { NewConversationModal } from './NewConversationModal'

type propsType = {
    id: string
}

const CONVERSATIONS_KEY = 'conversations'
const CONTACT_KEY = 'contacts'

export const Sidebar = ({ id }: propsType) => {
    const [activeKey, setActiveKey]= useState(CONVERSATIONS_KEY)
    const [modalOpen, setModalOpen] = useState(false)
    const conversationsOpen = activeKey === CONVERSATIONS_KEY
    
    function closeModal() {
        setModalOpen(false)
    }

    return (
        <div style={{ width: '250px' }} className="d-flex flex-column">
            <Tab.Container activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey || '')}>
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={CONTACT_KEY}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-end overflow-auto flex-grow-1">
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACT_KEY}>
                        <Contacts />
                    </Tab.Pane>
                </Tab.Content>
                <div className="p-2 border-top border-end small">
                    Your ID: <span className="text-muted">
                        {id}
                    </span>
                </div>
                <Button onClick={() => setModalOpen(true)} className="rounded-0">
                    New {conversationsOpen ? 'Conversation': 'Contact'}
                </Button>
            </Tab.Container>

            <Modal show={modalOpen} onHide={closeModal}>
                {
                    conversationsOpen ? 
                    <NewConversationModal closeModal={closeModal} /> :
                    <NewContactModal closeModal={closeModal} />
                }
            </Modal>
        </div>
    )
}
