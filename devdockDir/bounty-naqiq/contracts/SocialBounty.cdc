import FungibleToken from 0xFungibleToken

access(all) contract SocialBounty {
    access(all) event BountyCreated(id: UInt64, amount: UFix64, deadline: UFix64)
    access(all) event SubmissionAdded(bountyId: UInt64, participant: Address, tweetUrl: String)
    access(all) event WinnerSelected(bountyId: UInt64, winner: Address)

    access(all) struct Submission {
        access(all) let participant: Address
        access(all) let tweetUrl: String
        access(all) let timestamp: UFix64
        access(all) let likes: UInt64
        access(all) let retweets: UInt64

        init(participant: Address, tweetUrl: String) {
            self.participant = participant
            self.tweetUrl = tweetUrl
            self.timestamp = getCurrentBlock().timestamp
            self.likes = 0
            self.retweets = 0
        }
    }

    access(all) struct Bounty {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let amount: UFix64
        access(all) let deadline: UFix64
        access(all) let submissions: {Address: Submission}
        access(all) var winner: Address?

        init(id: UInt64, creator: Address, amount: UFix64, deadline: UFix64) {
            self.id = id
            self.creator = creator
            self.amount = amount
            self.deadline = deadline
            self.submissions = {}
            self.winner = nil
        }
    }

    access(all) let bounties: @{UInt64: Bounty}
    access(all) var nextBountyId: UInt64

    init() {
        self.bounties = {}
        self.nextBountyId = 1
    }
}