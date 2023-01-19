import React, { useContext, createContext } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

export type contact = {
    id: string | number;
    name: string;
}

export interface createContextParamsType {
    contacts: contact[];
    createContact: (id?: string | number, name?: string) => void 
}

const ContactsContext = createContext<createContextParamsType | null>(null)

export function useContacts() {
    const useContactContext = useContext(ContactsContext)
    if(!useContactContext) {
        throw new Error(
          'useContacts has to be used within <ContactContext.Provider>'
        )
    }

    return useContactContext
}

export let ContactsProvider = ({ children }: { children: JSX.Element}) => {
    const [contacts, setContacts] = useLocalStorage('contacts', [])

    function createContact(id?: string | number, name?: string) {
        setContacts((prevContacts: any) => {
            return [...prevContacts, { id, name }]
        })
    }

    return (
        <ContactsContext.Provider value={{contacts, createContact}}>
            {children}
        </ContactsContext.Provider>
    )

}
