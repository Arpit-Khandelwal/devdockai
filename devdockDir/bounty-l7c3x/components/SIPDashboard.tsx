import { useState } from 'react';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { parseEther } from 'viem';
import { SIP_MANAGER_ADDRESS, SIP_MANAGER_ABI } from '../constants';

export function SIPDashboard() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<number[]>([]);

  const {
    address: SIP_MANAGER_ADDRESS,
    abi: SIP_MANAGER_ABI,
    functionName: 'userPlans',
    args: [address],
  });

  const { write: createPlan } = useContractWrite({
    address: SIP_MANAGER_ADDRESS,
    abi: SIP_MANAGER_ABI,
    functionName: 'createPlan',
  });

  const handleCreatePlan = () => {
    createPlan({
      args: [parseEther(amount), frequency, tokens, allocations],
    });
  };

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Investment Amount (ETH)</label>
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        />
      </div>
      
      <div>
        <label className='block text-sm font-medium'>Frequency (seconds)</label>
        <input
          type='number'
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        />
      </div>

      <button
        onClick={handleCreatePlan}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        Create SIP Plan
      </button>

      {userPlan && userPlan.active && (
        <div className='mt-8'>
          <h2 className='text-2xl font-bold'>Your Active Plan</h2>
          <p>Amount: {userPlan.amount} ETH</p>
          <p>Frequency: {userPlan.frequency} seconds</p>
        </div>
      )}
    </div>
  );
}