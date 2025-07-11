'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative bg-gray-100 py-20 md:py-32 lg:py-40">
      {/* Background Image (Optional) */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-image.avif" // Replace with your actual image
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="opacity-60" // Adjust opacity as needed
        />
        <div className="absolute inset-0 bg-primary-foreground opacity-10 mix-blend-overlay"></div> {/* Optional overlay */}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Discover a wide selection of properties for sale and rent in Ghana.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex rounded-md shadow-md bg-white p-2 md:p-3">
          <Input
            type="text"
            placeholder="Enter location, city, or property ID"
            className="w-full rounded-l-md focus-visible:ring-primary"
          />
          <Button className="rounded-r-md">
            <Search className="h-5 w-5 mr-2" /> Search
          </Button>
        </div>

        {/* Optional Call to Action Buttons */}
        {/* <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Explore Listings</Button>
          <Button variant="outline" size="lg">Find Agents</Button>
        </div> */}
      </div>
    </div>
  );
}