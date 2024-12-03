import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import { Reclaim } from '@reclaimprotocol/js-sdk'

export function TransactionList() {
    const [transactions, setTransactions] = useState([])
    const reclaim = new Reclaim('YOUR_APP_ID')
    
    const submitTransaction = async (recipient: string, amount: number) => {
        try {
            const response = await fcl.mutate({
                cadence: `
                    import MultiSigWallet from 0xMultiSigWallet
                    
                    transaction(recipient: Address, amount: UFix64) {
                        prepare(signer: AuthAccount) {
                            MultiSigWallet.submitTransaction(recipient: recipient, amount: amount)
                        }
                    }
                `,
                args: (arg, t) => [
                    arg(recipient, t.Address),
                    arg(amount.toFixed(8), t.UFix64)
                ]
            })
            await fcl.tx(response).onceSealed()
        } catch (error) {
            console.error('Error submitting transaction:', error)
        }
    }
    
    const approveTransaction = async (txId: number) => {
        try {
            // Generate Reclaim proof
            const proof = await reclaim.connect()
            
            const response = await fcl.mutate({
                cadence: `
                    import MultiSigWallet from 0xMultiSigWallet
                    
                    transaction(txId: UInt64, proof: String) {
                        prepare(signer: AuthAccount) {
                            MultiSigWallet.approveTransaction(txId: txId, reclaimProof: proof)
                        }
                    }
                `,
                args: (arg, t) => [
                    arg(txId, t.UInt64),
                    arg(proof, t.String)
                ]
            })
            await fcl.tx(response).onceSealed()
        } catch (error) {
            console.error('Error approving transaction:', error)
        }
    }
    
    return (
        <div>
            {/* Transaction list UI */}
        </div>
    )
}