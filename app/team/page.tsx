import Team from '@/components/sections/Team';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — EvolVIT',
  description: 'Meet the passionate minds behind EvolVIT — the team driving innovation at VIT.',
};

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Team />
      </main>
      <Footer />
    </>
  );
}
