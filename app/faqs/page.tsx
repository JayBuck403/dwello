"use client";

import Navbar from "@/components/header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I search for properties?",
    answer:
      "Use the search bar on the homepage or the 'Properties' page to filter by location, price, type, and amenities.",
  },
  {
    question: "How do I contact an agent about a property?",
    answer:
      "Each listing includes the agent’s contact details along with a direct WhatsApp button for instant communication.",
  },
  {
    question: "Can I save properties I like?",
    answer:
      "Yes, registered users can save listings by clicking the heart icon. Access saved properties anytime from your profile.",
  },
  {
    question: "Are the listings verified?",
    answer:
      "We verify property submissions and agents before publishing. However, users should always perform due diligence.",
  },
];

export default function FAQPage() {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Frequently Asked Questions
          </h1>

          <Accordion
            type="single"
            collapsible
            className="rounded-lg bg-white divide-y divide-gray-200 border border-gray-200"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="px-6 py-4"
              >
                <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm leading-relaxed mt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer />
    </div>
  );
}
