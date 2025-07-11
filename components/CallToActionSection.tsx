"use client";

import { Button } from "@/components/ui/button";

export default function CallToActionSection() {
  return (
    <section className="py-16 bg-primary-foreground">
      <div className="container mx-auto text-center text-primary">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Find Your Dream Property in Ghana?
        </h2>
        <p className="text-lg mb-8">
          Let us help you navigate the Ghanaian real estate market and find the
          perfect place to call home or your next investment opportunity.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Explore All Listings</Button>
          {/* <Button variant="outline" size="lg">Contact Our Agents</Button> */}
          {/* Optional: Button to list a property */}
          <Button variant="secondary" size="lg">
            List Your Property
          </Button>
        </div>
      </div>
    </section>
  );
}
