import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Testimonials from '@/components/sections/Testimonials';
import EventsPreview from '@/components/sections/EventsPreview';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventsPreview />
        <ProjectsPreview />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
