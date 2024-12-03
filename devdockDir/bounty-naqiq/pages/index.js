import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

export default function Home() {
  const [user, setUser] = useState(null)
  const [tweetUrl, setTweetUrl] = useState('')

  useEffect(() => {
    fcl.currentUser().subscribe(setUser)
  }, [])

  const submitEntry = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import SocialBounty from 0x9d2ade18cb6bea1a
          
          transaction(tweetUrl: String) {
            prepare(acct: AuthAccount) {
              // Submit entry logic
            }
          }
        `,
        args: (arg, t) => [arg(tweetUrl, t.String)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999
      })
      
      console.log('Transaction ID:', transactionId)
    } catch (error) {
      console.error('Error submitting entry:', error)
    }
  }

  return (
    <div className='container'>
      <h1>Social Media Bounty Contest</h1>
      {user?.addr ? (
        <div>
          <p>Connected as: {user.addr}</p>
          <input 
            type='text'
            placeholder='Enter your tweet URL'
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
          />
          <button onClick={submitEntry}>Submit Entry</button>
        </div>
      ) : (
        <button onClick={fcl.logIn}>Connect Wallet</button>
      )}
    </div>
  )
}