import Projects from '@/components/sections/Projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — EvolVIT',
  description: 'Real products built by EvolVIT students — from AI platforms to web apps. Explore our project showcase.',
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Projects />
      </main>
      <Footer />
    </>
  );
}
