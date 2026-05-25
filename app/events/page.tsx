import Events from '@/components/sections/Events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events — EvolVIT',
  description: 'Explore EvolVIT events — hackathons, workshops, summits, and more. Join us and learn through real experiences.',
};

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Events />
      </main>
      <Footer />
    </>
  );
}
