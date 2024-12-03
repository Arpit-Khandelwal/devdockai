import { SIPDashboard } from '../components/SIPDashboard';

export default function Home() {
  return (
    <main className='min-h-screen p-8'>
      <h1 className='text-4xl font-bold mb-8'>SIP Investment Dashboard</h1>
      <SIPDashboard />
    </main>
  );
}