import FungibleToken from 0xFungibleToken

pub contract MultiSigWallet {
    pub var owners: {Address: Bool}
    pub var requiredApprovals: UInt64
    pub var transactionCount: UInt64
    pub var transactions: {UInt64: Transaction}
    pub var approvals: {UInt64: {Address: Bool}}
    
    pub struct Transaction {
        pub let id: UInt64
        pub let recipient: Address
        pub let amount: UFix64
        pub let executed: Bool
        
        init(id: UInt64, recipient: Address, amount: UFix64) {
            self.id = id
            self.recipient = recipient
            self.amount = amount
            self.executed = false
        }
    }
    
    init() {
        self.owners = {}
        self.requiredApprovals = 3 // Requires 3 out of 4 approvals
        self.transactionCount = 0
        self.transactions = {}
        self.approvals = {}
        
        // Add initial owners
        self.owners[0x01] = true
        self.owners[0x02] = true
        self.owners[0x03] = true
        self.owners[0x04] = true
    }

    pub fun submitTransaction(recipient: Address, amount: UFix64) {
        pre {
            self.owners[self.account.address] != nil: "Not an owner"
        }
        
        let txId = self.transactionCount
        let newTx = Transaction(id: txId, recipient: recipient, amount: amount)
        self.transactions[txId] = newTx
        self.approvals[txId] = {}
        self.transactionCount = txId + 1
    }
    
    pub fun approveTransaction(txId: UInt64, reclaimProof: String) {
        pre {
            self.owners[self.account.address] != nil: "Not an owner"
            self.transactions[txId] != nil: "Transaction does not exist"
            self.approvals[txId]![self.account.address] == nil: "Already approved"
        }
        
        // Verify Reclaim proof here
        // This is a placeholder - actual verification would happen through Reclaim protocol
        self.approvals[txId]![self.account.address] = true
    }
    
    pub fun executeTransaction(txId: UInt64) {
        pre {
            self.transactions[txId] != nil: "Transaction does not exist"
        }
        
        let approvalCount = self.approvals[txId]!.length
        if approvalCount >= self.requiredApprovals {
            // Execute transaction logic here
            self.transactions[txId]!.executed = true
        }
    }
}