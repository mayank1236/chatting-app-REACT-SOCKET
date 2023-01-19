import React, { useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const SocketContext = React.createContext<Socket | null>(null)

export function useSocket() {
    return useContext(SocketContext)
}

export const SocketProvider = ({id, children}: {id: string; children: JSX.Element}) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const newSocket = io(
            'http://localhost:5000', 
            { query: { id }}
        )

        setSocket(newSocket)

        return () => {newSocket.disconnect()}
    }, [id])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
