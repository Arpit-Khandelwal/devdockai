import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

export function WalletConnect() {
    const [user, setUser] = useState({ loggedIn: false })
    
    useEffect(() => {
        fcl.currentUser.subscribe(setUser)
    }, [])
    
    const connectWallet = () => {
        fcl.authenticate()
    }
    
    const disconnectWallet = () => {
        fcl.unauthenticate()
    }
    
    return (
        <div>
            {user.loggedIn 
                ? <button onClick={disconnectWallet}>Disconnect Wallet</button>
                : <button onClick={connectWallet}>Connect Wallet</button>
            }
        </div>
    )
}