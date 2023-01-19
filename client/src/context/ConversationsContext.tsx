import React, { useContext, createContext, useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useContacts } from "./ContactsContext"
import { useSocket } from "./SocketProvider";

type recipient = {
  'id': string;
  'name': string;
}

type message = {
  sender: string
  text: string
  fromMe ?: boolean
  senderName?: string
}

interface conversation { 
  recipients: recipient[]
  messages: message[]
  selected: boolean
}

export type createConversation = (recipients: string[]) => void

interface createContextParamsType {
    conversations: conversation[]
    selectedConversation: conversation
    selectConversationIndex: React.Dispatch<React.SetStateAction<number>>
    createConversation:  createConversation
    sendMessage: (recipients: string[], text: string) => void
}



const ConversationsContext = createContext<createContextParamsType | null>(null)

export function useConversations() {
    const useConversationContext = useContext(ConversationsContext)
    if(!useConversationContext) {
        throw new Error(
          'useConversations has to be used within <ConversationContext.Provider>'
        )
    }

    return useConversationContext
}

export let ConversationsProvider = ({ id, children }: { id: string; children: JSX.Element}) => {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectedConversationIndex, setSelectedConversationIndex] = useState<number>(0)
    const { contacts } = useContacts()
    const socket = useSocket()

    type tempConversation = { recipients: string[]; messages: message[] }

    function createConversation(recipients: string[]) {
        setConversations((prevConversations: tempConversation[]) => {
            return [...prevConversations, { recipients, messages: [] }]
        })
    }

    type addMessageToConversationParams = { recipients: string[], text: string, sender: string}
    const addMessageToConversation = useCallback(({ recipients, text, sender}: addMessageToConversationParams) => {
      setConversations((prevConversations: tempConversation[]) => {
        let madeChange = false
        const newMessage = { sender, text }
        const newConversations = prevConversations.map(conversation => {
          if(arrayEquality(conversation.recipients, recipients)) {
            madeChange = true
            return {...conversation, messages: [...conversation.messages, newMessage]}
          }
          return conversation
        })

        if(madeChange) {
          return newConversations
        } else {
          return [...prevConversations, { recipients, messages: [newMessage]}]
        }

      })
    }, [setConversations])

    useEffect(() => {
      if(socket == null) return

      socket.on('receive-message', addMessageToConversation)

      return () => {socket.off('receive-message')}
    }, [socket, addMessageToConversation])

    function sendMessage(recipients: string[], text: string) {
      socket?.emit('send-message', {recipients, text});
      addMessageToConversation({recipients, text, sender: id})
    }

    const formattedConversations: conversation[] = conversations.map((conversation: tempConversation, index: number) => {
      const recipients = conversation.recipients.map((recipient) => {
        const contact = contacts.find(contact => {
          return String(contact.id) === String(recipient)
        })
        const name: string = String(contact ? contact.name : recipient)
        return { id: recipient, name: name }
      })
      const messages = conversation.messages.map(message => {
        const contact = contacts.find(contact => {
          return contact.id === message.sender
        })
        const name: string = contact ? contact.name : message.sender
        const fromMe = id === message.sender
        return { ...message, senderName: name, fromMe }
      })
      const selected = index === selectedConversationIndex
      return { ...conversation, messages, recipients, selected }
    })


    const value: createContextParamsType = {
      conversations: formattedConversations,
      selectedConversation: formattedConversations[selectedConversationIndex],
      sendMessage,
      selectConversationIndex: setSelectedConversationIndex,
      createConversation
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )

}


function arrayEquality<T>(a: T[] , b: T[]): boolean{
  if(a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element: T, index: number) => {
    return element === b[index]
  })
}