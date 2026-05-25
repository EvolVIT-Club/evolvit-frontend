import About from '@/components/sections/About';
import Initiatives from '@/components/sections/Initiatives';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — EvolVIT',
  description: 'Learn about EvolVIT — a student-driven tech community at VIT passionate about AI, development, and innovation.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <About />
        <Initiatives />
      </main>
      <Footer />
    </>
  );
}
