pub contract DevdockBounty {

    pub struct Submission {
        pub let id: UInt64
        pub let creator: Address
        pub let youtubeLink: String
        pub let timestamp: UFix64

        init(id: UInt64, creator: Address, youtubeLink: String) {
            self.id = id
            self.creator = creator
            self.youtubeLink = youtubeLink
            self.timestamp = getCurrentBlock().timestamp
        }
    }

    pub var submissions: {UInt64: Submission}
    pub var nextSubmissionID: UInt64
    pub var bountyAmount: UFix64
    pub var bountyCreator: Address
    pub var submissionsLeft: UInt64
    pub var deadline: UFix64

    init() {
        self.submissions = {}
        self.nextSubmissionID = 1
        self.bountyAmount = 25000.0
        self.bountyCreator = 0x9d2ade18cb6bea1a
        self.submissionsLeft = 50
        self.deadline = 1709337600.0 // March 12, 2024
    }

    pub fun submitEntry(youtubeLink: String) {
        pre {
            self.submissionsLeft > 0: "No more submissions allowed"
            getCurrentBlock().timestamp <= self.deadline: "Bounty has expired"
        }

        let submission = Submission(
            id: self.nextSubmissionID,
            creator: self.bountyCreator,
            youtubeLink: youtubeLink
        )

        self.submissions[self.nextSubmissionID] = submission
        self.nextSubmissionID = self.nextSubmissionID + 1
        self.submissionsLeft = self.submissionsLeft - 1
    }
}