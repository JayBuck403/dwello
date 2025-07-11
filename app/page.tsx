// app/page.tsx
import CallToActionSection from '@/components/CallToActionSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import Footer from '@/components/Footer';
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyChooseUsSection from '@/components/WhyChooseUs';

export default function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeaturedPropertiesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
      {/* Other sections will go here */}
    </div>
  );
}