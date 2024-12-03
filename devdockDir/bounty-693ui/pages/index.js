import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

export default function Home() {
  const [user, setUser] = useState(null)
  const [youtubeLink, setYoutubeLink] = useState('')

  useEffect(() => {
    fcl.currentUser().subscribe(setUser)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import DevdockBounty from 0x9d2ade18cb6bea1a

          transaction(youtubeLink: String) {
            execute {
              DevdockBounty.submitEntry(youtubeLink: youtubeLink)
            }
          }
        `,
        args: (arg, t) => [arg(youtubeLink, t.String)],
        limit: 100
      })

      console.log('Submission successful:', transactionId)
    } catch (error) {
      console.error('Error submitting:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Devdock Bounty Submission</h1>
      
      {!user?.addr ? (
        <button onClick={fcl.authenticate}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {user?.addr}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Enter YouTube video link"
              className="border p-2 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  )