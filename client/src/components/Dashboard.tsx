import React from 'react'
import { useConversations } from '../context/ConversationsContext'
import { OpenConversation } from './OpenConversation'
import { Sidebar } from './Sidebar'

type propsType = {
    id: string
}

export const Dashboard = ({ id }: propsType) => {
  const { selectedConversation } = useConversations()
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar id={id} />
        { selectedConversation && <OpenConversation /> }
    </div>
  )
}
