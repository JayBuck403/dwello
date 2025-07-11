'use client';

import { CheckCircle } from 'lucide-react'; // Example icon
import { Card, CardContent } from '@/components/ui/card';

const benefits = [
  {
    id: 1,
    title: 'Wide Selection of Properties',
    description: 'Discover a diverse range of houses, apartments, land, and commercial spaces across Ghana.',
    icon: CheckCircle,
  },
  {
    id: 2,
    title: 'Expert Local Agents',
    description: 'Connect with experienced and knowledgeable agents who understand the Ghanaian real estate market.',
    icon: CheckCircle,
  },
  {
    id: 3,
    title: 'Easy and Intuitive Search',
    description: 'Our platform offers powerful search tools and filters to help you find the perfect property quickly.',
    icon: CheckCircle,
  },
  {
    id: 4,
    title: 'Trusted and Verified Listings',
    description: 'We ensure the authenticity and accuracy of all our property listings for your peace of mind.',
    icon: CheckCircle,
  },
  // Add more benefits here
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-white px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="rounded-xl shadow-md">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-primary-foreground text-primary p-3 mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}