import Contact from '@/components/sections/Contact';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — EvolVIT',
  description: 'Get in touch with EvolVIT. Join our community, ask questions, or collaborate with us.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
