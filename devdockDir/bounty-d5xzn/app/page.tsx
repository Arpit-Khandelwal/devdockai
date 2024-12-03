"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk';

export default function Home() {
  const [address, setAddress] = useState('');
  const [contributions, setContributions] = useState(0);
  const [loading, setLoading] = useState(false);

  const APP_ID = "YOUR_APP_ID";
  const APP_SECRET = "YOUR_APP_SECRET";
  const PROVIDER_ID = "GITHUB_PROVIDER_ID";

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  }

  async function verifyGithubContributions() {
    setLoading(true);
    try {
      const reclaim = new reclaimprotocol.Reclaim();
      
      const request = await reclaim.request({
        title: 'GitHub Contributions Verification',
        callbackUrl: window.location.origin,
        appId: "0x50f48049c72bAFc0f2F3c6C6F48B6d0271C38F83",
        appSecret: "0xfdc1ae446cb63567b570aab15fc035378c53efbd59b969d5bb6b53860e85d0eb",
        providers: [{
          provider: "8573efb4-4529-47d3-80da-eaa7384dac19",
          params: {}
        }]
      });

      const { requestId } = request;
      const proofUrl = request.generateUrl();
      
      window.location.href = proofUrl;
    } catch (error) {
      console.error('Error verifying contributions:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">GitHub Contributor Rewards</h1>
        
        {!address ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>Connected: {address}</p>
            <button
              onClick={verifyGithubContributions}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify GitHub Contributions'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}