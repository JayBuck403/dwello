'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Finding our dream home in Accra was a breeze with this platform. The agents were incredibly helpful and the listings were accurate. Highly recommended!",
    name: "Ama Nkrumah",
    image: "/avatar-1.avif",
  },
  {
    id: 2,
    quote: "I was looking to invest in property in Kumasi and found exactly what I needed here. The process was smooth and professional. Thank you!",
    name: "Kwabena Owusu",
    image: "/avatar-2.avif",
  },
  {
    id: 3,
    quote: "Renting an apartment in Tema has never been easier. The search filters are great, and I found a perfect place within my budget.",
    name: "Yaa Asantewaa",
    image: "/avatar-3.avif",
  },
  // Add more testimonials here
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-8">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-xl bg-white shadow-md p-6">
              <Quote className="h-6 w-6 text-primary mb-4" />
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center justify-center gap-4">
                <Avatar>
                  {testimonial.image ? (
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  {/* You could add their city or other info here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}